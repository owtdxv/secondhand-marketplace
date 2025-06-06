import { ChatRoomInfo } from "../../types/chat";
import styles from "@/styles/components/chatRoom.module.css";
import { User } from "../../types/user";
import DefaultProfile from "@/assets/default_profile.png";

interface PropsType {
  user: User;
  data: ChatRoomInfo;
}

const ChatRoom = ({ user, data }: PropsType) => {
  const isUnread = data.lastMessage?.read?.[user._id] === false;
  return (
    <div className={styles.chatRoomContainer}>
      <div className={styles.profileImgWrapper}>
        <img
          className={styles.profileImg}
          src={data.otherUser.profileImage || DefaultProfile}
        />
        {isUnread && <span className={styles.unreadDot} />}
      </div>
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
          {data.lastMessage?.message ?? ""}
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
