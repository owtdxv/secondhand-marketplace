import React, { useEffect, useRef, useState } from "react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import styles from "@/styles/components/chatWidget.module.css";
import ChatRoomListContainer from "../../pages/chatRoomList";
import { User } from "../../types/user";
import { motion, AnimatePresence } from "framer-motion";
import ChatContainer from "../../pages/chat";
import X from "@/assets/icon/X.png";
import { io, Socket } from "socket.io-client";
import axios from "axios";

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
  const socketRef = useRef<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        sessionStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));

    // ✅ logout 이벤트 핸들러 등록
    const handleLogout = () => {
      sessionStorage.removeItem("token");
      setUser(null);
    };

    window.addEventListener("logout", handleLogout);

    // ✅ 컴포넌트 언마운트 시 이벤트 제거
    return () => {
      window.removeEventListener("logout", handleLogout);
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      setVisible(true);
    }
  }, [loading]);

  const handleClose = () => {
    setVisible(false); // exit 애니메이션 실행
  };

  useEffect(() => {
    if (user && !socketRef.current) {
      socketRef.current = io("http://localhost:8000", {
        auth: {
          token: sessionStorage.getItem("token"),
        },
      });

      socketRef.current.on("connect", () => {
        setSocketConnected(true);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    } else {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocketConnected(false);
    }

    return () => {
      if (socketRef.current && socketRef.current.connected) {
        console.log("Disconnecting socket on unmount or user change");
        socketRef.current.disconnect();
        setSocketConnected(false);
      }
    };
  }, [user]);

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
          {!loading && user && socketConnected && socketRef.current && (
            <>
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
                        <ChatRoomListContainer
                          user={user}
                          socket={socketRef.current}
                        />
                      </>
                    }
                  />
                  <Route
                    path="/room/:id"
                    element={<ChatContainer socket={socketRef.current} />}
                  />
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
