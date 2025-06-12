import { useMemo } from "react";
import { Message } from "../../types/chat";
import styles from "@/styles/pages/gemini.module.css";
import gemini from "@/assets/icon/gemini.png";
import { ChatMessage } from "../../types/gemini";

interface GeminiProps {
  messages: string | undefined;
  handleCompositionStart: () => void;
  handleCompositionEnd: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleButtonClick: () => void;
  btnRef: React.RefObject<HTMLButtonElement | null>;
  messagesRref: React.RefObject<HTMLDivElement | null>; // ChatContainer에서 이 이름으로 ref를 전달하고 있음
  input: string;
}

const Gemini: React.FC<GeminiProps> = ({
  messages,
  handleCompositionStart,
  handleCompositionEnd,
  handleKeyDown,
  onChange,
  handleButtonClick,
  btnRef,
  messagesRref,
  input,
}) => {
  return (
    <div>
      <div className={styles.chatContainer}>
        <div className={styles.chatContainer}>
          <div className={styles.chatBox} ref={messagesRref}>
            <div className={`${styles.messageRow} ${styles.otherUserRow}`}>
              <img
                src={gemini}
                className={styles.messageProfilePic} // 메시지용 프로필 사진 클래스
              />
              <div className={styles.messageContentArea}>
                <span className={styles.messageSenderNickname}>Gemini</span>
                <div className={styles.bubbleAndTimeWrapper}>
                  <div
                    className={`${styles.messageBubble} ${styles.otherUserBubble}`}
                  >
                    <p>
                      안녕하세요! 😊 찾고 계신 상품이 있다면 상품에 대한 정보를
                      입력해 주세요!
                      <br />
                      상품을 찾아보고 해당 페이지로 안내해 드릴게요!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {messages && (
              <>
                <div
                  className={`${styles.messageRow} ${styles.currentUserRow}`}
                >
                  <div className={styles.messageContentArea}>
                    <div className={styles.bubbleAndTimeWrapper}>
                      <div
                        className={`${styles.messageBubble} ${styles.currentUserBubble}`}
                      >
                        <p>{messages}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${styles.messageRow} ${styles.otherUserRow}`}>
                  <img
                    src={gemini}
                    className={styles.messageProfilePic} // 메시지용 프로필 사진 클래스
                  />
                  <div className={styles.messageContentArea}>
                    <span className={styles.messageSenderNickname}>Gemini</span>
                    <div className={styles.bubbleAndTimeWrapper}>
                      <div
                        className={`${styles.messageBubble} ${styles.otherUserBubble}`}
                      >
                        <p>
                          상품을 찾아보고 있어요!
                          <br />
                          조회가 완료되면 해당 페이지로 이동할게요!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className={styles.inputContainer}>
          <input
            type="text"
            className={styles.input}
            placeholder="채팅을 입력해주세요."
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onKeyDown={handleKeyDown}
            onChange={onChange}
            value={input}
            disabled={messages !== undefined}
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

export default Gemini;
