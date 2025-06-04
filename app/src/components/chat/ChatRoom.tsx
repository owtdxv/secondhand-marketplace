import { ChatRoomInfo } from "../../types/chat";
import styles from "@/styles/components/chatRoom.module.css";

interface PropsType {
  data: ChatRoomInfo;
}

const ChatRoom = ({ data }: PropsType) => {
  return (
    <div className={styles.chatRoomContainer}>
      <img
        className={styles.profileImg}
        src={data.otherUser.profileImage || undefined}
        alt={`${data.otherUser.displayName} 프로필 이미지`}
      />
      <div className={styles.chatInfo}>
        <div className={styles.userRow}>
          <div className={styles.userName}>{data.otherUser.displayName}</div>
          <div className={styles.timestamp}>
            {new Date(data.createdAt).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </div>
        <div className={styles.lastMessage}>
          {data.lastMessage.message ?? "..."}
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
