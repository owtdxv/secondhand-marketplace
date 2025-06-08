import React, { useEffect, useState } from "react";
import { createRoot, Root } from "react-dom/client";

import styles from "@/styles/components/bottomHeader.module.css";
import Logo from "@/assets/Logo.png";
import chat from "@/assets/icon/chat.png";
import myPage from "@/assets/icon/person.png";
import sale from "@/assets/icon/sale.png";
import { useNavigate } from "react-router-dom";

// Update the import path if the file exists elsewhere, for example:
import ChatWidget from "../chat/ChatWidget";

let chatRoot: Root | null = null;
let isChatOpen = false;

const toggleChatUI = () => {
  const chatContainer = document.getElementById("chat-root");
  if (!chatContainer) return;

  if (isChatOpen) {
    return;
  }

  // 열 때 chatRoot 없으면 생성
  if (!chatRoot) {
    chatRoot = createRoot(chatContainer);
  }

  chatRoot.render(
    <ChatWidget
      onClose={() => {
        chatRoot?.unmount();
        chatRoot = null;
        isChatOpen = false;
        window.dispatchEvent(new Event("chatWidgetClose"));
      }}
    />
  );

  window.dispatchEvent(new Event("chatWidgetOpen"));
  isChatOpen = true;
};

const BottomHeader = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <img
          onClick={() => {
            navigate("/");
          }}
          className={styles.logo}
          src={Logo}
        />
        <input
          className={styles.search}
          type="text"
          placeholder="상품명을 검색해보세요."
          aria-label="상품 검색"
        />
        <ul className={styles.menu}>
          <li
            onClick={() => {
              navigate("/add-product");
            }}
            className={styles.item}
          >
            <img width={25} src={sale} />
            <p className={styles.text}>판매하기</p>
          </li>
          <li
            onClick={() => {
              navigate("/mypage");
            }}
            className={styles.item}
          >
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
