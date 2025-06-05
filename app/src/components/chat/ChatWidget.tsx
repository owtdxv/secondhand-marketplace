import React, { useEffect, useState } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import styles from "@/styles/components/chatWidget.module.css";
import ChatRoomListContainer from "../../pages/chatRoomList";
import { motion, AnimatePresence } from "framer-motion";
import ChatContainer from "../../pages/chat";
import X from "@/assets/icon/X.png";
import useAuthUser from "../../hooks/useAuthUser";
import useChatSocket from "../../hooks/useChatSocket";

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
  const { user, loading } = useAuthUser();
  const { socket, connected } = useChatSocket(sessionStorage.getItem("token"));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!loading) setVisible(true);
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
          {loading && <div>로딩 중...</div>}
          {!loading && !user && <LoginPrompt />}
          {!loading && user && connected && socket && (
            <MemoryRouter>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <div className={styles.chatBox}>
                        <span className={styles.title}>채팅</span>
                        <img
                          src={X}
                          alt="닫기"
                          className={styles.closeIcon}
                          onClick={handleClose}
                        />
                      </div>
                      <ChatRoomListContainer user={user} socket={socket} />
                    </>
                  }
                />
                <Route
                  path="/room/:id"
                  element={<ChatContainer socket={socket} />}
                />
              </Routes>
            </MemoryRouter>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWidget;
