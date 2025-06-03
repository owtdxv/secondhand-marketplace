import React, { useEffect, useState } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import styles from "@/styles/components/chatWidget.module.css";
import ChatRoomListContainer from "../../pages/chatRoomList";
import { User } from "../../types/user";

const Room = () => {
  // Room 컴포넌트는 그대로 둡니다
  // 필요시 props로 사용자 정보 전달 가능
  return (
    <>
      <p>2번 (채팅방)</p>
    </>
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

const ChatWidget: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setLoading(false); // 비로그인 상태
      return;
    }

    // 토큰이 있으면 사용자 정보 요청
    fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("인증 실패");
        return res.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        // 인증 실패 시 토큰 제거
        sessionStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className={styles.chatWidgetContainer}>로딩 중...</div>;
  }

  if (!user) {
    // 로그인 안 됐을 때 보여줄 화면
    return (
      <div className={styles.chatWidgetContainer}>
        <LoginPrompt />
      </div>
    );
  }

  return (
    <div className={styles.chatWidgetContainer}>
      <p>사용자 uid = {user?._id}</p>
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
