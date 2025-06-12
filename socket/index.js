require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");

const User = require("./models/User");
const ChatRoom = require("./models/ChatRoom");
const Message = require("./models/Message");
const Product = require("./models/Product");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { MongoDBAtlasVectorSearch } = require("@langchain/mongodb");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

const app = express();
const server = http.createServer(app);
const NGROK_URL = process.env.NGROK_URL;
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5500", NGROK_URL], // 반드시 지정해야 함
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = 8000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5500", NGROK_URL],
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error: ", err);
  });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.1,
});

const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "embedding-001", // 임베딩 모델은 변경하지 않아도 됩니다.
  apiKey: process.env.GEMINI_API_KEY,
  clientOptions: {
    baseUrl: "https://generativelanguage.googleapis.com/", // 명시적인 baseUrl 유지
  },
  apiVersion: "v1", // API 버전 명시적으로 지정
});

async function populateVectorStore() {
  try {
    // Product 모델의 데이터가 이미 존재하는지 확인
    const productCount = await Product.countDocuments({});
    if (productCount === 0) {
      console.log(
        "벡터 저장소에 추가할 상품이 존재하지 않습니다. Product 컬렉션에 먼저 데이터를 추가해주세요."
      );
      return;
    }

    // product_vectors 컬렉션에 데이터가 이미 존재하는지 확인
    const vectorStoreCollection =
      mongoose.connection.collection("product_vectors");
    const existingVectorCount = await vectorStoreCollection.countDocuments({});

    if (existingVectorCount > 0) {
      console.log(
        "product_vectors 컬렉션에 이미 데이터가 존재합니다. 벡터 저장소 채우기를 건너뜁니다."
      );
      return;
    }

    // 기존 product_vectors 컬렉션을 비우는 로직은 데이터가 없을 때만 실행되므로, 이 조건문 안으로 이동합니다.
    // await mongoose.connection.collection("product_vectors").deleteMany({}); // 이 부분은 이제 위에 있는 existingVectorCount 조건문에서 처리됩니다.

    console.log("product_vectors 컬렉션이 비어 있으므로 새로 채웁니다.");

    const products = await Product.find({}).lean();

    const docs = products.map((product) => ({
      pageContent: `상품명: ${product.name}, 카테고리: ${product.category}, 가격: ${product.price}원, 설명: ${product.description}`,
      metadata: {
        _id: product._id.toString(),
        name: product.name,
        category: product.category,
        likes: product.likes,
        price: product.price,
      },
    }));

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await textSplitter.splitDocuments(docs);

    const vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(
      splitDocs,
      embeddings,
      {
        collection: mongoose.connection.collection("product_vectors"),
        indexName: "default", // 변경된 인덱스 이름 적용
        textKey: "pageContent",
        embeddingKey: "embedding",
      }
    );
    console.log("Vector store가 상품 데이터로 성공적으로 채워졌습니다.");
  } catch (error) {
    console.error("Vector store 채우기 중 에러 발생: ", error);
  }
}

populateVectorStore().catch(console.error);

async function retrieveProductInfo(query) {
  console.log(`[retrieveProductInfo] 함수 호출됨. 검색 쿼리: "${query}"`);

  const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection: mongoose.connection.collection("product_vectors"),
    indexName: "default", // 변경된 인덱스 이름 적용
    textKey: "pageContent",
    embeddingKey: "embedding",
  });
  console.log(
    "[retrieveProductInfo] MongoDBAtlasVectorSearch 인스턴스 생성 완료."
  );

  let queryEmbedding;
  try {
    queryEmbedding = await embeddings.embedQuery(query);
    if (!queryEmbedding || queryEmbedding.length === 0) {
      console.error(
        "[retrieveProductInfo] 쿼리 임베딩 생성 실패: 반환된 임베딩이 비어있거나 유효하지 않습니다."
      );
      return [];
    }
    if (queryEmbedding.length !== 768) {
      console.warn(
        `[retrieveProductInfo] 경고: 쿼리 임베딩 길이가 예상(768)과 다릅니다: ${queryEmbedding.length}`
      );
    }
    console.log(
      `[retrieveProductInfo] 쿼리 임베딩 성공. 길이: ${queryEmbedding.length}`
    );
  } catch (err) {
    console.error(
      `[retrieveProductInfo] 쿼리 임베딩 생성 중 오류 발생: ${err.message}`,
      err
    );
    return [];
  }

  let relevantDocs = [];
  try {
    relevantDocs = await vectorStore.similaritySearch(query, 3);
    console.log(
      `[retrieveProductInfo] 유사도 검색 완료. 발견된 문서 수: ${relevantDocs.length}`
    );
    if (relevantDocs.length === 0) {
      console.log(
        "[retrieveProductInfo] 유사한 상품을 찾지 못했습니다 (relevantDocs 배열 비어있음)."
      );
    }
  } catch (err) {
    console.error(
      `[retrieveProductInfo] 유사도 검색 중 오류 발생: ${err.message}`,
      err
    );
    return [];
  }

  const productInfo = relevantDocs
    .map((doc, index) => {
      if (!doc || !doc.metadata || !doc.pageContent) {
        console.warn(
          `[retrieveProductInfo] 경고: 유효하지 않은 문서 구조 발견 (인덱스 ${index}):`,
          doc
        );
        return null;
      }

      let description = "정보 없음";
      const descriptionMatch = doc.pageContent.match(/설명: (.*)/);
      if (descriptionMatch && descriptionMatch[1]) {
        description = descriptionMatch[1].trim();
      } else {
        console.warn(
          `[retrieveProductInfo] 경고: 문서 (ID: ${doc.metadata._id})의 pageContent에서 설명을 추출할 수 없습니다. pageContent: "${doc.pageContent}"`
        );
      }

      console.log(
        `[retrieveProductInfo] 문서 ${index} 추출 정보: _id=${doc.metadata._id}, name=${doc.metadata.name}`
      );
      return {
        _id: doc.metadata._id,
        name: doc.metadata.name,
        category: doc.metadata.category,
        description: description,
        likes: doc.metadata.likes,
        price: doc.metadata.price,
      };
    })
    .filter(Boolean);

  return productInfo;
}

app.get("/", (req, res) => {
  res.send("test");
});

// ... (이전 코드 생략) ...

io.on("connection", (socket) => {
  console.log("클라이언트 연결: ", socket.id);

  socket.on("joinRoom", async ({ chatRoomId }) => {
    socket.join(chatRoomId);
    await ChatRoom.updateOne(
      { _id: chatRoomId },
      { $set: { isNewChatRoom: false } }
    );
    console.log(`${socket.id} joined room ${chatRoomId}`);
  });

  socket.on("joinUser", async ({ uid }) => {
    socket.join(uid);
    console.log(`${uid} 연결`);
  });

  socket.on("readUpdate", async ({ chatRoomId, uid }) => {
    await Message.updateMany(
      { chatRoomId: chatRoomId },
      { $set: { [`read.${uid}`]: true } }
    );
  });

  socket.on("sendAIMessage", async ({ uid, query }) => {
    // io.to(uid.toString()).emit("navigate"); // 이 부분도 uid 대신 socket.id를 사용하는 것이 더 적절할 수 있습니다.
    try {
      const retrievedProducts = await retrieveProductInfo(query);

      // 검색된 상품이 없을 경우의 처리
      if (retrievedProducts.length === 0) {
        console.log(
          "AI에게 전달할 상품 정보가 없습니다. '찾을 수 없음' 응답을 생성합니다."
        );
        const noProductPrompt = `사용자 질의 "${query}"에 대해 관련된 상품 정보를 찾을 수 없습니다. 사용자에게 이 사실을 친절하게 알려주세요.`;
        const noProductResult = await model.invoke(noProductPrompt);
        const noProductResponseText = noProductResult.content;

        // 클라이언트로 "찾을 수 없음" 메시지 전송
        // uid 대신 socket.id를 사용합니다.
        socket.emit("aiResponse", { message: noProductResponseText });
        return; // 더 이상 진행하지 않고 함수 종료
      }

      // 검색된 상품들의 _id를 추출
      const productIds = retrievedProducts.map((p) => p._id);
      console.log(`검색된 상품 ID 목록: ${productIds.join(", ")}`);

      // ----------------------------------------------------
      // AI 프롬프트 구성 및 호출 (기존 로직)
      // ----------------------------------------------------
      const productContext = retrievedProducts
        .map(
          (p) =>
            `상품명: ${p.name}, 카테고리: ${p.category}, 가격: ${p.price}원, 설명: ${p.description}, 좋아요: ${p.likes}, _id: ${p._id}`
        )
        .join("\n\n");

      const prompt = `사용자가 상품 정보를 요청했습니다. 다음 상품 정보들을 참조하여 사용자의 질의와 가장 관련성이 높은 상품을 요약해서 알려주세요. 반드시 응답 마지막 줄에 "_id: [상품의 ID]" 형식으로 _id를 제공하세요. 형식을 반드시 지켜주세요.

--- 상품 정보 ---
${productContext}
---
사용자 질의: "${query}"

응답 형식 예시:
- 질의와 가장 관련 있는 상품 정보 요약
- _id: 65e7dabc1234abcd5678efgh
`;

      const result = await model.invoke(prompt);
      const responseText = result.content;
      console.log("응답 정보: ", responseText);
      const idRegex = /_id:\s*([a-f0-9]{24})/;
      const match = responseText.match(idRegex);
      const relevantProductId = match ? match[1] : "찾을 수 없음";

      console.log(
        "Gemini 응답에서 추출된 최고 좋아요 상품 ID:",
        relevantProductId
      );

      // ----------------------------------------------------
      // 클라이언트로 정보 전송 (수정된 부분)
      // socket.id를 사용하여 메시지를 보낸 특정 클라이언트에만 응답합니다.
      // ----------------------------------------------------
      socket.emit("aiResponse", {
        // ✨ uid.toString() 대신 socket.emit 사용
        message: responseText, // AI가 생성한 전체 응답 텍스트
        retrievedProductIds: productIds, // 검색된 3개의 상품 ID 목록
        relevantProductId: relevantProductId,
      });
    } catch (error) {
      console.error("Error processing product query: ", error);
      socket.emit("aiResponse", {
        message: "AI 응답 처리 중 오류가 발생했습니다.",
      }); // ✨ uid.toString() 대신 socket.emit 사용
    }
  });

  socket.on("sendMessage", async ({ chatRoomId, senderId, message }) => {
    try {
      console.log(`메세지 전송: ${chatRoomId}, ${senderId}, ${message}`);
      if (!chatRoomId || !senderId || !message) return;

      await ChatRoom.findByIdAndUpdate(chatRoomId, { updatedAt: new Date() });

      const chatRoomData = await ChatRoom.findById(chatRoomId).populate(
        "participants",
        "_id"
      );

      const readStatus = {};
      chatRoomData.participants.forEach((user) => {
        if (user._id == senderId) {
          readStatus[user._id.toString()] = true;
        } else {
          readStatus[user._id.toString()] = false;
        }
      });

      const newMessage = await Message.create({
        chatRoomId,
        senderId,
        message,
        sentAt: new Date(),
        read: readStatus,
      });

      io.to(chatRoomId).emit("newMessage", newMessage);
      chatRoomData.participants.forEach(async (user) => {
        const userId = user._id.toString();
        io.to(userId).emit("msgListUpdate");

        if (userId != senderId) {
          const sendData = await Message.findById(newMessage.id).populate(
            "senderId",
            "_id displayName profileImage"
          );

          io.to(userId).emit("notification", sendData);
        }
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("navigate", ({ uid, productId }) => {
    io.to(uid.toString()).emit("navigate", productId);
  });

  socket.on("disconnect", () => {
    console.log("클라이언트 연결 해제: ", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`서버 실행(${PORT})`);
});
