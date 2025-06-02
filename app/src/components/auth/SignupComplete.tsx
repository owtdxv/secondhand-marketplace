import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "@/styles/pages/signup.module.css";
import Check from "@/assets/icon/check.png";

const SignupComplete = () => {
  const navigate = useNavigate(); // useNavigate 훅 인스턴스 생성
  const [countdown, setCountdown] = useState(3); // 카운트다운 상태 추가

  useEffect(() => {
    // 1. 카운트다운 타이머 설정
    const countdownTimer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000); // 1초마다 카운트다운 감소

    // 2. 3초 후 로그인 페이지로 이동
    const redirectTimer = setTimeout(() => {
      clearInterval(countdownTimer); // 리다이렉트 전에 카운트다운 타이머 정리
      navigate("/login"); // '/login' 경로로 이동
    }, 3000); // 3초 후 실행

    // 3. 컴포넌트 언마운트 시 타이머 정리 (메모리 누수 방지)
    return () => {
      clearInterval(countdownTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]); // navigate가 변경될 때마다 useEffect를 재실행하지 않도록 의존성 배열에 추가

  return (
    <div className={styles.signupPageContainer}>
      <div className={styles.signupFormWrapper}>
        <img src={Check} alt="Complete" className={styles.logoComplete} />
        <h1>회원가입 완료!</h1>
        <p>{countdown}초 뒤 로그인 화면으로 이동합니다</p>{" "}
        {/* 카운트다운 표시 */}
      </div>
    </div>
  );
};

export default SignupComplete;
