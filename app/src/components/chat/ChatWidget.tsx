import React, { useEffect, useState } from "react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import styles from "@/styles/components/chatWidget.module.css";
import ChatRoomListContainer from "../../pages/chatRoomList";
import { User } from "../../types/user";
import { motion, AnimatePresence } from "framer-motion";

const Room = () => {
  const nav = useNavigate();
  return (
    <div>
      <button onClick={() => nav("/")}>화면 전환</button>
      <p>채팅방</p>
    </div>
  );
};

const LoginPrompt = () => (
  <div style={{ padding: 20, textAlign: "center" }}>
    <p>로그인이 필요합니다.</p>
    <button onClick={() => (window.location.href = "/login")}>
      로그인 하러 가기
    </button>
  </div>
);

type ChatWidgetProps = {
  onClose: () => void;
};

const ChatWidget: React.FC<ChatWidgetProps> = ({ onClose }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setLoading(false);
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
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      setVisible(true);
    }
  }, [loading]);

  const handleClose = () => {
    setVisible(false); // exit 애니메이션 실행
  };

  return (
    <AnimatePresence
      onExitComplete={() => {
        onClose(); // exit 애니메이션 끝나면 부모에게 알림
      }}
    >
      {visible && (
        <motion.div
          className={styles.chatWidgetContainer}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <button
            onClick={handleClose}
            style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}
            aria-label="채팅창 닫기"
          >
            ✕
          </button>

          {loading && <div>로딩 중...</div>}
          {!loading && !user && <LoginPrompt />}
          {!loading && user && (
            <>
              <p>사용자 uid = {user._id}</p>
              <MemoryRouter>
                <Routes>
                  <Route path="/" element={<ChatRoomListContainer />} />
                  <Route path="/room/:id" element={<Room />} />
                </Routes>
              </MemoryRouter>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWidget;
