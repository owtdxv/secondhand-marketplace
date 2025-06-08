import styles from "@/styles/components/bottomHeader.module.css";
import Logo from "@/assets/Logo.png";

import chat from "@/assets/icon/chat.png";
import myPage from "@/assets/icon/person.png";
import sale from "@/assets/icon/sale.png";
import { useState } from "react";
import axios from "axios";

const BottomHeader = () => {
  const [showSearchDiv, setShowSearchDiv] = useState(false);
  const [inputValue, setInputValue] = useState(false);

  const clickSearchInput = () => {
    setShowSearchDiv((prev) => !prev);
  };

  const searchProduct = async () => {
    try {
      const res = await axios.get("/api/product/search", {
        params: { inputValue },
      });
      setShowSearchDiv(false);
    } catch (err) {
      console.error("상태 변경 실패", err);
    }
  };
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <img className={styles.logo} src={Logo} />
        <div className={styles.search}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="상품명을 검색해보세요"
            onFocus={() => setShowSearchDiv(true)}
            onBlur={() => setTimeout(() => setShowSearchDiv(false), 150)}
          />
          {showSearchDiv && <div className={styles.searchDropdown}>adsf</div>}
        </div>
        <ul className={styles.menu}>
          <li className={styles.item}>
            <img width={25} src={sale} />
            <p className={styles.text}>판매하기</p>
          </li>
          <li className={styles.item}>
            <img width={25} src={myPage} />
            <p className={styles.text}>마이페이지</p>
          </li>
          <li className={styles.item}>
            <img width={25} src={chat} />
            <p className={styles.text}>채팅하기</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BottomHeader;
