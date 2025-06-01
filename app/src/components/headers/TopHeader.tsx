import styles from "@/styles/components/topHeader.module.css";

const TopHeader = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <li className={`${styles.item} ${styles.login}`}>로그인</li>
        <li className={styles.item}>회원가입</li>
      </div>
    </div>
  );
};

export default TopHeader;
