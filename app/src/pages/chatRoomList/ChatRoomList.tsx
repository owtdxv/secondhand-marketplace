import { Socket } from "socket.io-client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ChatRoomListProps {}

const ChatRoomList: React.FC<ChatRoomListProps> = ({}) => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/room/:id")}>화면 전환</button>
      <p>채팅방 리스트 표시</p>
    </div>
  );
};

export default ChatRoomList;
