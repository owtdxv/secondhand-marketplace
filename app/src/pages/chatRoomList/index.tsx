import axios from "axios";
import { useState, useEffect } from "react";
import { ChatRoomInfo } from "../../types/chat";
import { User } from "../../types/user";
import ChatRoomList from "./ChatRoomList";
import { Socket } from "socket.io-client";

interface ChatRoomListContainerProps {
  user: User;
  socket: Socket | null;
}

const ChatRoomListContainer: React.FC<ChatRoomListContainerProps> = ({
  user,
  socket,
}) => {
  const [chatRooms, setChatRooms] = useState<ChatRoomInfo[]>([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("토큰이 없습니다");
          return;
        }

        const response = await axios.get(`/api/chat/rooms/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChatRooms(response.data);
      } catch (error) {
        console.log("채팅방 목록 불러오기 실패: ", error);
      }
    };

    fetchChatRooms();

    if (socket && socket.connected && user && user._id) {
      socket.emit("joinUser", { uid: user._id });

      socket.on("msgListUpdate", () => {
        fetchChatRooms();
      });
    }

    return () => {};
  }, [user, socket]);

  return <ChatRoomList chatRooms={chatRooms} />;
};

export default ChatRoomListContainer;
