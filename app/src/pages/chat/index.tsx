import { useEffect, useRef, useState } from "react";
import Chat from "./Chat";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { User } from "../../types/user";
import { ChatRoomInfo, Message } from "../../types/chat";
import { p } from "framer-motion/client";

const ChatContainer = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [input, setInput] = useState<string>("");
  const buttonRref = useRef<HTMLButtonElement>(null);
  const messagesRref = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { chatRoomData } = location.state as { chatRoomData: ChatRoomInfo };

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        if (!id) return;

        const response = await axios.get(`/api/chat/message/${id}`);
        setMessages(response.data);
      } catch (error) {
        console.log("메세지 목록 불러오기 실패: ", error);
      }
    };

    const fetchGetUserInfo = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        return;
      }

      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("인증 실패");
          return res.json();
        })
        .then((data) => {
          setUser(data);
        })
        .catch(() => {
          sessionStorage.removeItem("token");
          setUser(null);
        });
    };

    if (messagesRref.current) {
      messagesRref.current.scrollTop = messagesRref.current.scrollHeight;
    }

    fetchChatMessages();
    fetchGetUserInfo();
  }, [id]);

  const handleBack = () => {
    navigate("/");
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  // 한글 입력 완료 (IME 비활성화)
  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing && input != "") {
      e.preventDefault();
      buttonRref.current?.click();
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleButtonClick = () => {
    if (!user || !id || input.trim() === "") {
      // 사용자 정보가 없거나, 채팅방 ID가 없거나, 입력 내용이 없으면 아무것도 하지 않음
      console.warn(
        "메시지를 보낼 수 없습니다. 사용자 정보, 채팅방 ID 또는 입력 내용을 확인하세요."
      );
      return;
    }

    const newMessage: Message = {
      _id: Date.now().toString(),
      chatRoomId: id,
      senderId: {
        _id: user._id,
        displayName: user.displayName,
        profileImage: user.profileImage,
      },
      message: input.trim(),
      sentAt: new Date().toISOString(),
      read: false,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
  };

  useEffect(() => {
    if (messagesRref.current) {
      messagesRref.current.scrollTop = messagesRref.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <Chat
        chatRoomData={chatRoomData}
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
