import React from "react";
import {
  MemoryRouter,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import styles from "@/styles/components/chatWidget.module.css";
import ChatRoomListContainer from "../../pages/chatRoomList";

const Room = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  return (
    <>
      <p>2번 (채팅방 ID: {id})</p>
      <button onClick={() => navigate(-1)}>뒤로가기</button>
    </>
  );
};

const ChatWidget: React.FC = () => {
  return (
    <div className={styles.chatWidgetContainer}>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<ChatRoomListContainer />} />
          <Route path="/room/:id" element={<Room />} />
        </Routes>
      </MemoryRouter>
    </div>
  );
};

export default ChatWidget;
