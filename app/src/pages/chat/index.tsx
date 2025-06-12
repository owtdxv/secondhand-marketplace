import React, { useEffect, useRef, useState } from "react";
import Chat from "./Chat";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { User } from "../../types/user";
import { ChatRoomInfo, Message } from "../../types/chat";
import { Socket } from "socket.io-client";

interface ChatContainerProps {
  socket: Socket | null;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ socket }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [input, setInput] = useState<string>("");
  const buttonRref = useRef<HTMLButtonElement>(null);
  const messagesRref = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { id } = useParams<{ id: string }>(); // URL 파라미터에서 채팅방 ID 가져오기
  const location = useLocation();
  const navigate = useNavigate();

  // chatRoomData 상태: location.state에서 초기값을 가져오거나, 없을 경우 null로 시작
  const [chatRoomInfo, setChatRoomInfo] = useState<ChatRoomInfo | null>(
    (location.state as { chatRoomData?: ChatRoomInfo })?.chatRoomData || null
  );

  useEffect(() => {
    // 채팅방 정보를 불러오는 함수 (state에 없으면 API 호출)
    const fetchChatRoomInfo = async () => {
      // id가 없거나 이미 chatRoomInfo가 로드되어 있으면 불필요한 API 호출 방지
      if (!id || chatRoomInfo) return;

      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("토큰이 없습니다");
          alert("로그인이 필요한 서비스입니다.");
          navigate("/login");
          return;
        }

        // 백엔드의 @Get('/room/:id') API 호출
        const response = await axios.get(`/api/room/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChatRoomInfo(response.data);
      } catch (error) {
        console.error("채팅방 정보 불러오기 실패: ", error);
        alert("채팅방 정보를 불러올 수 없습니다.");
        navigate("/");
      }
    };

    // 메시지 목록을 불러오는 함수
    const fetchChatMessages = async () => {
      try {
        if (!id) return;

        const response = await axios.get(`/api/chat/message/${id}`);
        setMessages(response.data);
      } catch (error) {
        console.log("메세지 목록 불러오기 실패: ", error);
      }
    };

    // 현재 사용자 정보를 불러오는 함수
    const fetchGetUserInfo = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setUser(null);
        alert("로그인이 필요한 서비스입니다.");
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("인증 실패");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("사용자 정보 불러오기 실패: ", error);
        sessionStorage.removeItem("token");
        setUser(null);
        alert("사용자 정보를 불러올 수 없습니다. 다시 로그인해주세요.");
        navigate("/login");
      }
    };

    // 컴포넌트 마운트 시 모든 데이터 패치 실행
    fetchGetUserInfo();
    fetchChatRoomInfo();
    fetchChatMessages();

    // 메시지 스크롤을 항상 하단으로 이동
    if (messagesRref.current) {
      messagesRref.current.scrollTop = messagesRref.current.scrollHeight;
    }
  }, [id, navigate, chatRoomInfo]); // id, navigate, chatRoomInfo 변경 시 재실행

  // 메시지 배열이 업데이트될 때마다 스크롤을 최신 메시지로 이동
  useEffect(() => {
    if (messagesRref.current) {
      messagesRref.current.scrollTop = messagesRref.current.scrollHeight;
    }
  }, [messages]);

  // 소켓 통신 관련 로직
  useEffect(() => {
    // 소켓이 연결되고, 사용자 정보와 채팅방 ID가 있을 때만 소켓 로직 실행
    if (!socket || !user || !id) return;

    // 채팅방 조인 및 읽음 상태 업데이트
    socket.emit("joinRoom", {
      chatRoomId: id,
    });
    socket.emit("readUpdate", {
      chatRoomId: id,
      uid: user._id,
    });

    // 새 메시지 수신 핸들러
    const handleNewMessage = (newMessage: Message) => {
      socket.emit("readUpdate", {
        chatRoomId: id,
        uid: user._id,
      });
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("newMessage", handleNewMessage);

    // 컴포넌트 언마운트 시 이벤트 리스너 해제
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, user, id]); // socket, user, id 변경 시 재실행

  // 뒤로가기 핸들러
  const handleBack = () => {
    navigate("/");
  };

  // 한글 입력 시작 핸들러
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  // 한글 입력 완료 핸들러
  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  // 키보드 입력 핸들러 (Enter 키로 메시지 전송)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing && input !== "") {
      e.preventDefault();
      buttonRref.current?.click();
    }
  };

  // 입력 필드 변경 핸들러
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // 메시지 전송 버튼 클릭 핸들러
  const handleButtonClick = () => {
    if (!user || !id || input.trim() === "") {
      console.warn(
        "메시지를 보낼 수 없습니다. 사용자 정보, 채팅방 ID 또는 입력 내용을 확인하세요."
      );
      return;
    }

    if (socket && socket.connected && user && user._id) {
      socket.emit("sendMessage", {
        chatRoomId: id,
        senderId: user._id,
        message: input.trim(),
      });
    }
    setInput(""); // 전송 후 입력 필드 초기화
  };

  // chatRoomInfo 또는 user 데이터가 로드되지 않았을 경우 로딩 상태 표시
  if (!chatRoomInfo || !user) {
    return <div></div>;
  }

  return (
    <>
      <Chat
        chatRoomData={chatRoomInfo} // chatRoomInfo를 Chat 컴포넌트로 전달
        handleBack={handleBack}
        messages={messages}
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

export default ChatContainer;
