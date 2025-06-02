import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "@/styles/pages/login.module.css";
import Logo from "@/assets/Logo_full.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoginButtonEnabled, setIsLoginButtonEnabled] = useState(false);
  const navigate = useNavigate();

  // 이메일과 비밀번호 입력 시 로그인 버튼 활성화 여부 결정
  useEffect(() => {
    setIsLoginButtonEnabled(email.length > 0 && password.length > 0);
  }, [email, password]); // email 또는 password 상태가 변경될 때마다 실행

  // 이메일 입력 핸들러
  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
    // 입력이 시작되면 에러 메시지 제거 (사용자가 다시 입력하는 경우)
    if (e.target.value.length > 0 && emailError) {
      setEmailError("");
    }
  };

  // 비밀번호 입력 핸들러
  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
    // 입력이 시작되면 에러 메시지 제거
    if (e.target.value.length > 0 && passwordError) {
      setPasswordError("");
    }
  };

  // 로그인 버튼 클릭 핸들러
  const handleLogin = async () => {
    let hasError = false;

    // 1. 이메일 입력 필드 유효성 검사
    if (!email) {
      setEmailError("아이디를 입력해주세요.");
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("올바른 이메일 형식을 입력하세요.");
        hasError = true;
      } else {
        setEmailError("");
      }
    }

    // 2. 비밀번호 입력 필드 유효성 검사 (형식 제한 없음, 단순히 비어있는지만 확인)
    if (!password) {
      setPasswordError("비밀번호를 입력해주세요.");
      hasError = true;
    } else {
      // **비밀번호 형식 제한 제거**
      // 이전의 passwordRegex.test(password) 로직이 제거됨
      setPasswordError(""); // 비밀번호가 비어있지 않으면 에러 메시지 초기화
    }

    if (hasError) {
      return; // 유효성 검사 실패 시 로그인 프로세스 중단
    }

    // 3. 서버 통신
    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const { accessToken } = res.data;

      // 토큰 저장
      sessionStorage.setItem("token", accessToken);

      navigate("/"); // 로그인 성공 시 메인 페이지로 이동
    } catch (error: any) {
      // 서버 응답 오류 처리
      if (error.response?.status === 401) {
        setEmailError("이메일 또는 비밀번호가 올바르지 않습니다.");
        setPasswordError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        alert("로그인 실패: " + (error.response?.data?.error || error.message));
      }
    }
  };

  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.loginFormWrapper}>
        <img src={Logo} alt="로고" className={styles.logo} />

        {/* 아이디(이메일) 입력 필드 */}
        <div className={styles.inputGroup}>
          <label htmlFor="email">아이디</label>
          <input
            type="text"
            id="email"
            placeholder="이메일을 입력해주세요."
            value={email}
            onChange={handleEmailChange}
            className={emailError ? styles.inputError : ""}
          />
          {emailError ? (
            <p className={styles.errorMessage}>{emailError}</p>
          ) : (
            <p className={`${styles.errorMessage} ${styles.hidden}`}>.</p>
          )}
        </div>

        {/* 비밀번호 입력 필드 */}
        <div className={styles.inputGroup}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={handlePasswordChange}
            className={passwordError ? styles.inputError : ""}
          />
          {passwordError ? (
            <p className={styles.errorMessage}>{passwordError}</p>
          ) : (
            <p className={`${styles.errorMessage} ${styles.hidden}`}>.</p>
          )}
        </div>

        {/* 로그인 버튼 */}
        <button
          className={styles.loginButton}
          onClick={handleLogin}
          disabled={!isLoginButtonEnabled}
        >
          로그인
        </button>
        <a href="/signup" className={styles.registerLink}>
          회원가입
        </a>

        {/* 소셜 로그인 구분선 */}
        <div className={styles.socialLoginSeparator}>
          <span className={styles.separatorLine}></span>
          <span>소셜 로그인</span>
          <span className={styles.separatorLine}></span>
        </div>
      </div>
    </div>
  );
};

export default Login;
