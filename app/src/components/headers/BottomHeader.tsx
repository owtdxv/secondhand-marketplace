import styles from "@/styles/components/bottomHeader.module.css";
import Logo from "@/assets/Logo.png";

import chat from "@/assets/icon/chat.png";
import myPage from "@/assets/icon/person.png";
import sale from "@/assets/icon/sale.png";

const BottomHeader = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <img className={styles.logo} src={Logo} />
        <input
          className={styles.search}
          type="text"
          placeholder="상품명을 검색해보세요."
        />
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
