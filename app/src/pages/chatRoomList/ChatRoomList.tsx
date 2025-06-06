import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatRoomInfo } from "../../types/chat";
import ChatRoom from "../../components/chat/ChatRoom";
import styles from "@/styles/pages/chatRoomList.module.css";
import { User } from "../../types/user";

interface ChatRoomListProps {
  user: User;
  chatRooms: ChatRoomInfo[];
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({ user, chatRooms }) => {
  const navigate = useNavigate();
  return (
    <div>
      <div></div>
      {chatRooms.map((room) => (
        <div
          key={room._id}
          onClick={() =>
            navigate(`/room/${room._id}`, { state: { chatRoomData: room } })
          }
          style={{ cursor: "pointer" }}
        >
          <ChatRoom user={user} data={room} />
        </div>
      ))}
    </div>
  );
};

export default ChatRoomList;
