import styles from "@/styles/components/topHeader.module.css";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const TopHeader = () => {
  const [isLogin, setIsLogin] = useAuth();

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        {!isLogin ? (
          <>
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
          </>
        ) : (
          <>
            <li className={`${styles.item} ${styles.login}`}>
              <Link
                to="/"
                className={styles.link}
                onClick={() => {
                  sessionStorage.removeItem("token");
                  setIsLogin(false); // 너 왜그러는데 대체
                  console.log("로그아웃 dispatchEvent");
                  window.dispatchEvent(new Event("logout"));
                }}
              >
                로그아웃
              </Link>
            </li>
          </>
        )}
      </div>
    </div>
  );
};

export default TopHeader;
