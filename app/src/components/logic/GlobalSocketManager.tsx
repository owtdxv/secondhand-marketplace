import { useEffect, useRef, useState } from "react";
import { User } from "../../types/user";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { Message } from "../../types/chat";
import { createRoot, Root } from "react-dom/client";
import Notification from "../chat/Notification";

/**
 * 채팅 위젯이 닫혀있는 상황에 메시지를 수신하기 위함
 */

let isNotificationShowing = false;
let notificationRoot: Root | null = null;
const toggleNotificationUI = (message: Message) => {
  const notificationContainer = document.getElementById("notification-root");
  if (!notificationContainer) return;

  // 기존 알림이 있으면 unmount 먼저 실행
  if (isNotificationShowing && notificationRoot) {
    notificationRoot.unmount();
    notificationRoot = null;
    isNotificationShowing = false;
  }

  isNotificationShowing = true;

  const handleClose = () => {
    notificationRoot?.unmount();
    notificationRoot = null;
    isNotificationShowing = false;
  };

  notificationRoot = createRoot(notificationContainer);
  notificationRoot.render(
    <Notification message={message} onClose={handleClose} />
  );
};

export const GlobalSocketManager = () => {
  const [isLogin, setIsLogin] = useState(!!sessionStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(null);
  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);
  const isChatWidgetOpenRef = useRef(isChatWidgetOpen);
  const socketRef = useRef<Socket | null>(null);

  const getMyInfo = async () => {
    try {
      const response = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      setUser(response.data);
    } catch {
      sessionStorage.removeItem("token");
      setUser(null);
      setIsLogin(false);
    }
  };

  useEffect(() => {
    const handleLogin = () => {
      setIsLogin(true);
      getMyInfo();
      console.log("로그인 인식");
    };

    const handleLogout = () => {
      setIsLogin(false);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        console.log("전역 소켓 연결 해제");
      }
      setUser(null);
      console.log("로그아웃 인식");
    };

    window.addEventListener("login", handleLogin);
    window.addEventListener("logout", handleLogout);
    window.addEventListener("chatWidgetOpen", () => {
      setIsChatWidgetOpen(true);
      console.log("위젯 열림");
    });
    window.addEventListener("chatWidgetClose", () => {
      setIsChatWidgetOpen(false);
      console.log("위젯 닫힘");
    });

    if (isLogin) {
      getMyInfo();
    }

    return () => {
      window.removeEventListener("login", handleLogin);
      window.removeEventListener("logout", handleLogout);
    };
  }, [isLogin]);

  useEffect(() => {
    isChatWidgetOpenRef.current = isChatWidgetOpen;
  }, [isChatWidgetOpen]);

  useEffect(() => {
    if (isLogin && user && !socketRef.current) {
      socketRef.current = io("http://localhost:8000");

      socketRef.current.on("connect", () => {
        console.log("전역 소켓 연결됨");
        socketRef.current?.emit("joinUser", { uid: user._id });
      });

      socketRef.current.on("notification", (newMessage: Message) => {
        if (!isChatWidgetOpenRef.current) {
          toggleNotificationUI(newMessage);
        }
      });
    }

    // 로그아웃 또는 의존성 변경 시 소켓 연결 해제
    return () => {
      if (!isLogin && socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        console.log("전역 소켓 연결 해제");
      }
    };
  }, [isLogin, user]);

  return null;
};
