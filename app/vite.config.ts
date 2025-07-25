import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  // Proxy 설정
  server: {
    allowedHosts: ["master-valid-glider.ngrok-free.app"],
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      "/ws": {
        target: "http://localhost:8000",
        ws: true, // <-- WebSocket 사용 명시
        changeOrigin: true,
      },
    },
  },
});
