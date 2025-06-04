import React, { useMemo } from "react"; // useMemo import 추가
import { ChatRoomInfo, Message } from "../../types/chat";
import styles from "@/styles/pages/chat.module.css";
import BackIcon from "@/assets/icon/Arrow_forward.png";
import AttachIcon from "@/assets/icon/Attach_file.png";

interface ChatProps {
  chatRoomData: ChatRoomInfo;
  handleBack: () => void;
  messages: Message[];
  handleCompositionStart: () => void;
  handleCompositionEnd: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleButtonClick: () => void;
  btnRef: React.RefObject<HTMLButtonElement | null>;
  messagesRref: React.RefObject<HTMLDivElement | null>; // ChatContainer에서 이 이름으로 ref를 전달하고 있음
  input: string;
}

// 시간 포맷팅 함수 (기존)
const formatTime = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "오후" : "오전";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? "0" + minutes : String(minutes);
  return `${ampm} ${hours}:${minutesStr}`;
};

// 날짜 구분자용 포맷팅 함수 (YYYY.MM.DD)
const formatDateForSeparator = (
  dateInput: string | Date | undefined
): string => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}.${month}.${day}`;
};

// Chat 컴포넌트
const Chat: React.FC<ChatProps> = ({
  chatRoomData,
  handleBack,
  messages,
  handleCompositionStart,
  handleCompositionEnd,
  handleKeyDown,
  onChange,
  handleButtonClick,
  btnRef,
  messagesRref, // props로 받음
  input,
}) => {
  // 메시지를 날짜별로 그룹화하고 날짜 구분자를 포함하는 배열 생성
  const processedMessages = useMemo(() => {
    if (!messages || messages.length === 0) {
      return [];
    }

    const newProcessedItems: Array<{
      type: "date" | "message";
      content: string | Message;
      id: string;
    }> = [];
    let lastDate: string | null = null;

    messages.forEach((msg) => {
      const messageDateStr = formatDateForSeparator(msg.sentAt);
      if (messageDateStr !== lastDate) {
        newProcessedItems.push({
          type: "date",
          content: messageDateStr,
          id: `date-${messageDateStr}`,
        });
        lastDate = messageDateStr;
      }
      newProcessedItems.push({ type: "message", content: msg, id: msg._id });
    });
    return newProcessedItems;
  }, [messages]); // messages 배열이 변경될 때만 재계산

  return (
    <div>
      <div className={styles.headerContainer}>
        <img
          src={BackIcon}
          alt="뒤로가기"
          onClick={handleBack}
          className={styles.backIcon}
        />
        <img
          src={chatRoomData.otherUser.profileImage}
          alt="프로필"
          className={styles.messageProfilePic} // 헤더용 프로필 이미지 스타일 사용
        />
        <span className={styles.nickname}>
          {chatRoomData.otherUser.displayName}
        </span>
      </div>
      <div className={styles.chatContainer}>
        <div className={styles.chatBox} ref={messagesRref}>
          {" "}
          {/* ref 연결 */}
          {processedMessages.map((item) => {
            if (item.type === "date") {
              return (
                <div key={item.id} className={styles.dateSeparator}>
                  {item.content as string}
                </div>
              );
            }

            // item.type === 'message'
            const msg = item.content as Message;
            const isOtherUserMessage =
              msg.senderId._id === chatRoomData.otherUser._id;
            const formattedTime = formatTime(msg.sentAt);

            return (
              <div
                key={item.id} // msg._id 대신 item.id 사용 (고유 ID)
                className={`${styles.messageRow} ${
                  isOtherUserMessage
                    ? styles.otherUserRow
                    : styles.currentUserRow
                }`}
              >
                {isOtherUserMessage && (
                  <img
                    src={
                      msg.senderId.profileImage ||
                      chatRoomData.otherUser.profileImage
                    }
                    alt={msg.senderId.displayName}
                    className={styles.messageProfilePic} // 메시지용 프로필 사진 클래스
                  />
                )}
                <div className={styles.messageContentArea}>
                  {isOtherUserMessage && (
                    <span className={styles.messageSenderNickname}>
                      {msg.senderId.displayName}
                    </span>
                  )}
                  <div className={styles.bubbleAndTimeWrapper}>
                    {!isOtherUserMessage && (
                      <span className={`${styles.messageTimestamp}`}>
                        {formattedTime}
                      </span>
                    )}
                    <div
                      className={`${styles.messageBubble} ${
                        isOtherUserMessage
                          ? styles.otherUserBubble
                          : styles.currentUserBubble
                      }`}
                    >
                      <p>{msg.message}</p>
                    </div>
                    {isOtherUserMessage && (
                      <span
                        className={`${styles.messageTimestamp} ${styles.otherMessageTimestamp}`}
                      >
                        {formattedTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.inputContainer}>
          {/* ... (기존 입력창 코드) ... */}
          <img src={AttachIcon} alt="파일 첨부" className={styles.attachIcon} />
          <input
            type="text"
            className={styles.input}
            placeholder="채팅을 입력해주세요."
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onKeyDown={handleKeyDown}
            onChange={onChange}
            value={input}
          />
          <button
            ref={btnRef}
            type="button"
            style={{ display: "none" }}
            onClick={handleButtonClick}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
