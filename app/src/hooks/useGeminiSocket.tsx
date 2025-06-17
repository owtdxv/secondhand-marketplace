import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const useGeminiSocket = (token: string | null) => {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket_server_uri = import.meta.env.VITE_SOCKET_SERVER_URI;
    socketRef.current = io(window.location.origin, {
      path: "/ws",
    });

    socketRef.current.on("connect", () => setConnected(true));
    socketRef.current.on("disconnect", () => setConnected(false));

    return () => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.disconnect();
      }
      setConnected(false);
      socketRef.current = null;
    };
  }, [token]);

  return { socket: socketRef.current, connected };
};

export default useGeminiSocket;
