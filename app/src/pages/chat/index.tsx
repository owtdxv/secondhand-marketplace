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

  useEffect(() => {
    if (!socket || !user || !user._id) return;

    socket.emit("joinRoom", {
      chatRoomId: id,
    });

    const handleNewMessage = (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, user?._id]);

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

    if (socket && socket.connected && user && user._id) {
      socket.emit("sendMessage", {
        chatRoomId: id,
        senderId: user._id,
        message: input.trim(),
      });
    }
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
