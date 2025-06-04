import styles from "@/styles/components/topHeader.module.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TopHeader = () => {
  const [isLogin, setIsLogin] = useState(!!sessionStorage.getItem("token"));

  useEffect(() => {
    const handleLogin = () => {
      setIsLogin(!!sessionStorage.getItem("token"));
    };

    window.addEventListener("login", handleLogin);

    return () => {
      window.removeEventListener("login", handleLogin);
    };
  }, []);

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
                  setIsLogin(false);
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
