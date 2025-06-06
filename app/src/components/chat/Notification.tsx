import React, { useEffect, useState } from "react";
import { Message } from "../../types/chat";
import styles from "@/styles/components/notification.module.css";
import DefaultProfile from "@/assets/default_profile.png";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationProps {
  message: Message;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false); // exit 애니메이션 실행
    }, 3000); // 5초 표시

    return () => clearTimeout(timer);
  }, []);

  // exit 애니메이션 종료 후 onClose 호출
  const handleAnimationComplete = () => {
    if (!visible) onClose();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.container}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onAnimationComplete={handleAnimationComplete}
        >
          <div className={styles.chatRoomContainer}>
            <div className={styles.profileImgWrapper}>
              <img
                className={styles.profileImg}
                src={message.senderId.profileImage || DefaultProfile}
                alt="프로필 이미지"
              />
            </div>
            <div className={styles.chatInfo}>
              <div className={styles.userRow}>
                <div className={styles.userName}>
                  {message.senderId.displayName}
                </div>
                <div className={styles.timestamp}>
                  {new Date(message.sentAt).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>
              <div className={styles.lastMessage}>{message.message}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
