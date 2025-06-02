import styles from "@/styles/components/topHeader.module.css";
import { Link } from "react-router-dom";

const TopHeader = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <li className={`${styles.item} ${styles.login}`}>
          <Link to="/login" className={styles.link}>
            로그인
          </Link>
        </li>
        <li className={styles.item}>
          <Link to="/signup" className={styles.link}>
            회원가입
          </Link>
        </li>
      </div>
    </div>
  );
};

export default TopHeader;
