import styles from "@/styles/pages/login.module.css";
import Logo from "@/assets/Logo_full.png";
import { LoginProps } from "../../types/auth";
import NaverLogo from "@/assets/naver_Logo.png";

const Login: React.FC<LoginProps> = ({
  email,
  password,
  emailError,
  passwordError,
  isLoginButtonEnabled,
  onEmailChange,
  onPasswordChange,
  onLogin,
  onNaverLogin,
}) => {
  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.loginFormWrapper}>
        <img src={Logo} alt="로고" className={styles.logo} />

        <div className={styles.inputGroup}>
          <label htmlFor="email">아이디</label>
          <input
            type="text"
            id="email"
            placeholder="이메일을 입력해주세요."
            value={email}
            onChange={onEmailChange} // props로 받은 핸들러 사용
            className={emailError ? styles.inputError : ""}
          />
          {emailError ? (
            <p className={styles.errorMessage}>{emailError}</p>
          ) : (
            <p className={`${styles.errorMessage} ${styles.hidden}`}>.</p>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={onPasswordChange} // props로 받은 핸들러 사용
            className={passwordError ? styles.inputError : ""}
          />
          {passwordError ? (
            <p className={styles.errorMessage}>{passwordError}</p>
          ) : (
            <p className={`${styles.errorMessage} ${styles.hidden}`}>.</p>
          )}
        </div>

        <button
          className={styles.loginButton}
          onClick={onLogin} // props로 받은 핸들러 사용
          disabled={!isLoginButtonEnabled}
        >
          로그인
        </button>
        <a href="/signup" className={styles.registerLink}>
          회원가입하기
        </a>

        <div className={styles.socialLoginSeparator}>
          <span className={styles.separatorLine}></span>
          <span className={styles.separatorMargin}>소셜 로그인</span>
          <span className={styles.separatorLine}></span>
        </div>
        <button className={styles.naverLoginButton} onClick={onNaverLogin}>
          <img src={NaverLogo} alt="네이버 로고" className={styles.naverLogo} />
          <span className={styles.naverText}>네이버 로그인</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
