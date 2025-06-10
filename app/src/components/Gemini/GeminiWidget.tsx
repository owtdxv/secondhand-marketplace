import React, { useEffect, useState } from "react";
import styles from "@/styles/components/geminiWidget.module.css";
import { motion, AnimatePresence } from "framer-motion";
import X from "@/assets/icon/X.png";
import useAuthUser from "../../hooks/useAuthUser";
import useGeminiSocket from "../../hooks/useGeminiSocket";
import GeminiContainer from "../../pages/gemini";

const LoginPrompt = () => (
  <div style={{ padding: 20, textAlign: "center" }}>
    <p>로그인이 필요합니다.</p>
    <button onClick={() => (window.location.href = "/login")}>
      로그인 하러 가기
    </button>
  </div>
);

type GeminiWidgetProps = {
  onClose: () => void;
};

const GeminiWidget: React.FC<GeminiWidgetProps> = ({ onClose }) => {
  const { user, loading } = useAuthUser();
  const { socket, connected } = useGeminiSocket(
    sessionStorage.getItem("token")
  );
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
          className={styles.geminiWidgetContainer}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {loading && <div>로딩 중...</div>}
          {!loading && !user && <LoginPrompt />}
          {!loading && connected && user && socket && (
            <>
              <div className={styles.geminiBox}>
                <span className={styles.title}>AI와 대화하기</span>
                <img
                  src={X}
                  alt="닫기"
                  className={styles.closeIcon}
                  onClick={handleClose}
                />
              </div>
              <GeminiContainer socket={socket} />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GeminiWidget;
