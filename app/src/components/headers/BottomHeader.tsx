import React from "react";
import { createRoot, Root } from "react-dom/client";

import styles from "@/styles/components/bottomHeader.module.css";
import Logo from "@/assets/Logo.png";
import chat from "@/assets/icon/chat.png";
import myPage from "@/assets/icon/person.png";
import sale from "@/assets/icon/sale.png";

import ChatWidget from "@/components/chat/ChatWidget";

let chatRoot: Root | null = null;
let isChatOpen = false;

const toggleChatUI = () => {
  const chatContainer = document.getElementById("chat-root");
  if (!chatContainer) return;

  if (isChatOpen) {
    // 닫을 때 unmount 후 chatRoot를 null로 초기화
    chatRoot?.unmount();
    chatRoot = null;
    isChatOpen = false;
  } else {
    // 열 때 chatRoot가 없으면 새로 생성
    if (!chatRoot) {
      chatRoot = createRoot(chatContainer);
    }
    chatRoot.render(<ChatWidget />);
    isChatOpen = true;
  }
};

const BottomHeader: React.FC = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <img className={styles.logo} src={Logo} alt="로고" />
        <input
          className={styles.search}
          type="text"
          placeholder="상품명을 검색해보세요."
          aria-label="상품 검색"
        />
        <ul className={styles.menu}>
          <li className={styles.item}>
            <img width={25} src={sale} alt="판매하기 아이콘" />
            <p className={styles.text}>판매하기</p>
          </li>
          <li className={styles.item}>
            <img width={25} src={myPage} alt="마이페이지 아이콘" />
            <p className={styles.text}>마이페이지</p>
          </li>
          <li
            className={styles.item}
            onClick={toggleChatUI}
            style={{ cursor: "pointer" }}
          >
            <img width={25} src={chat} alt="채팅하기 아이콘" />
            <p className={styles.text}>채팅하기</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BottomHeader;
