import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { User } from "../../types/user";
import { Socket } from "socket.io-client";
import Gemini from "./Gemini";
import { AiResponseData, ChatMessage } from "../../types/gemini";

interface GeminiContainerProps {
  socket: Socket | null;
}

const GeminiContainer: React.FC<GeminiContainerProps> = ({ socket }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [input, setInput] = useState<string>("");
  const buttonRref = useRef<HTMLButtonElement>(null);
  const messagesRref = useRef<HTMLDivElement>(null);
  // 💡 messages 상태의 타입을 ChatMessage 배열로 변경
  const [messages, setMessages] = useState<string | undefined>();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    axios
      .get("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        alert("사용자 정보를 불러올 수 없습니다");
      });

    if (messagesRref.current) {
      messagesRref.current.scrollTop = messagesRref.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (messagesRref.current) {
      messagesRref.current.scrollTop = messagesRref.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!socket || !user) return;

    const handleNewMessage = (data: AiResponseData) => {
      // 💡 AI 응답을 ChatMessage 객체 형태로 messages에 추가합니다.
      const aiMessage: ChatMessage = {
        type: "aiResponse",
        content: data.message, // AI가 생성한 주요 응답 텍스트
        productIds: data.retrievedProductIds, // 검색된 상품 ID 목록
        highestLikedId: data.highestLikedProductId, // AI가 선택한 최고 좋아요 상품 ID
      };
      if (aiMessage.productIds && aiMessage.productIds.length > 0) {
        socket.emit("navigate", {
          uid: user._id,
          productId: aiMessage.productIds[0],
        });
      }
    };

    socket.on("aiResponse", handleNewMessage);

    return () => {
      socket.off("aiResponse", handleNewMessage);
    };
  }, [socket, user]);

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing && input.trim() !== "") {
      // input.trim() 추가
      e.preventDefault();
      handleButtonClick(); // 직접 handleButtonClick 호출
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleButtonClick = () => {
    const trimmedInput = input.trim();
    if (!user || trimmedInput === "") {
      // trimmedInput 사용
      console.warn(
        "메시지를 보낼 수 없습니다. 사용자 정보 또는 입력 내용을 확인하세요."
      );
      return;
    }

    setMessages(trimmedInput);
    if (socket && socket.connected && user && user._id) {
      // 상품데이터가 제대로 준비되면 사용하기
      //socket.emit("sendAIMessage", { uid: user._id, query: trimmedInput }); // trimmedInput 사용
    }
    setInput(""); // 전송 후 입력 필드 초기화
  };

  return (
    <>
      <Gemini
        messages={messages} // 💡 이제 messages는 ChatMessage[] 타입입니다.
        handleCompositionStart={handleCompositionStart}
        handleCompositionEnd={handleCompositionEnd}
        handleKeyDown={handleKeyDown}
        onChange={onChange}
        handleButtonClick={handleButtonClick}
        btnRef={buttonRref}
        messagesRref={messagesRref}
        input={input}
      />
    </>
  );
};

export default GeminiContainer;
