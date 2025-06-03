import React from "react";
import {
  MemoryRouter,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <p>1번 (홈)</p>
      <button onClick={() => navigate("/room/123")}>채팅방 123 이동</button>
    </>
  );
};

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
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 300,
        height: 400,
        border: "1px solid #ccc",
        backgroundColor: "white",
        zIndex: 1000,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        padding: 10,
      }}
    >
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:id" element={<Room />} />
        </Routes>
      </MemoryRouter>
    </div>
  );
};

export default ChatWidget;
