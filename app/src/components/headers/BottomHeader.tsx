import React, { useEffect, useState } from "react";
import { createRoot, Root } from "react-dom/client";

import styles from "@/styles/components/bottomHeader.module.css";
import Logo from "@/assets/Logo.png";
import chat from "@/assets/icon/chat.png";
import myPage from "@/assets/icon/person.png";
import sale from "@/assets/icon/sale.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import closeButton from "../../assets/icon/Close.png";
// Update the import path if the file exists elsewhere, for example:
import ChatWidget from "../chat/ChatWidget";
import { ProductInfo } from "../../types/product";

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
  const [showSearchDiv, setShowSearchDiv] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [recentKeywords, setRecentKeywords] = useState([""]);
  const [products, setProducts] = useState<ProductInfo>();
  const navigate = useNavigate();

  const fetchRecentKeywords = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get("/api/product/recent-keywords", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecentKeywords(res.data.keywords);
    } catch (err) {
      console.error("최근 검색어 불러오기 실패", err);
    }
  };

  const deleteRecentKeywords = async (keyword: string) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.delete("/api/product/recent-keywords", {
        headers: { Authorization: `Bearer ${token}` },
        params: { keyword: keyword },
      });
      setRecentKeywords(res.data.keywords);
    } catch (err) {
      console.error("검색어 삭제 실패", err);
    }
  };

  const handleSearch = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get("/api/product/search", {
        headers: { Authorization: `Bearer ${token}` },
        params: { input: inputValue },
      });
      setProducts(res.data); // 검색된 상품들 저장
      // 이제 저장 후에 검색 화면 제작하기
      setShowSearchDiv(false);
    } catch (err) {
      console.error("검색 실패", err);
    }
  };

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
        <div className={styles.search}>
          <input
            className={styles.searchInput}
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="상품명을 검색해보세요"
            onFocus={() => {
              setShowSearchDiv(true);
              fetchRecentKeywords();
            }}
            onBlur={() => setTimeout(() => setShowSearchDiv(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          {showSearchDiv && (
            <div className={styles.searchDropdown}>
              <p className={styles.title}>최근 검색어</p>
              {recentKeywords.length == 0 ? (
                <p className={styles.keyword}>최근 검색어 내역이 없습니다.</p>
              ) : (
                <div className={styles.keywordContainer}>
                  {recentKeywords.map((keyword, i) => (
                    <div className={styles.keywords}>
                      <span>{keyword}</span>
                      <img
                        src={closeButton}
                        style={{ width: "14px", height: "14px" }}
                        onMouseDown={(e) => {
                          e.preventDefault(); // 포커스 이동 방지
                          deleteRecentKeywords(keyword);
                        }}
                      />
                    </div>
                  ))}
                </div>
                // recentKeywords.map((keyword, i) => (
                //   <div className={styles.keywords}></div>
                //   // <p
                //   //   key={i}
                //   //   className={styles.keywords}
                //   //   onClick={() => {
                //   //     setInputValue(keyword);
                //   //     handleSearch(); // 선택한 검색어로 바로 검색
                //   //   }}
                //   // >
                //   //   {keyword}
                //   // </p>
                // ))
              )}
            </div>
          )}
        </div>
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
