import styles from "@/styles/pages/signup.module.css";
import Logo from "@/assets/Logo_full.png";
import { SignupProps } from "../../types/auth";

const Signup = ({
  email,
  displayName,
  password,
  confirmPassword,
  passwordMatch,
  passwordValid,
  emailCheckResult,
  nameCheckResult,
  errorMessage,
  isSignupButtonDisabled,
  onEmailChange,
  onDisplayNameChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onCheckEmailDuplicate,
  onCheckNameDuplicate,
  onSignup,
}: SignupProps) => {
  return (
    <div className={styles.signupPageContainer}>
      <div className={styles.signupFormWrapper}>
        <img src={Logo} alt="로고" className={styles.logo} />

        {/* 이메일 */}
        <div className={styles.inputGroup}>
          <label>이메일</label>
          <div className={styles.inputWithButton}>
            <input
              type="email"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={onEmailChange}
              className={emailCheckResult === true ? styles.inputError : ""}
            />
            <button
              type="button"
              onClick={onCheckEmailDuplicate}
              className={styles.checkButton}
              disabled={!email}
            >
              중복검사
            </button>
          </div>
          <p
            className={
              emailCheckResult === true
                ? styles.errorMessage
                : emailCheckResult === false
                ? styles.successMessage
                : styles.errorMessage
            }
            style={{
              visibility: emailCheckResult === null ? "hidden" : "visible",
            }}
          >
            {emailCheckResult === true && "사용이 불가능한 이메일입니다."}
            {emailCheckResult === false && "사용 가능한 이메일입니다."}
          </p>
        </div>

        {/* 닉네임 */}
        <div className={styles.inputGroup}>
          <label>닉네임</label>
          <div className={styles.inputWithButton}>
            <input
              type="text"
              placeholder="닉네임을 입력해주세요."
              value={displayName}
              onChange={onDisplayNameChange}
              className={nameCheckResult === true ? styles.inputError : ""}
            />
            <button
              type="button"
              onClick={onCheckNameDuplicate}
              className={styles.checkButton}
              disabled={!displayName}
            >
              중복검사
            </button>
          </div>
          <p
            className={
              nameCheckResult === true
                ? styles.errorMessage
                : nameCheckResult === false
                ? styles.successMessage
                : styles.errorMessage
            }
            style={{
              visibility: nameCheckResult === null ? "hidden" : "visible",
            }}
          >
            {nameCheckResult === true && "이미 사용 중인 닉네임입니다."}
            {nameCheckResult === false && "사용 가능한 닉네임입니다."}
          </p>
        </div>

        {/* 비밀번호 */}
        <div className={styles.inputGroup}>
          <label>비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={onPasswordChange}
            className={
              !passwordMatch || !passwordValid ? styles.inputError : ""
            }
          />
          <p
            className={styles.errorMessage}
            style={{ visibility: !passwordValid ? "visible" : "hidden" }}
          >
            비밀번호는 영문, 숫자, 특수문자를 포함하여 8~16자여야 합니다.
          </p>
        </div>

        {/* 비밀번호 확인 */}
        <div className={styles.inputGroup}>
          <label>비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호를 한번 더 입력해주세요."
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            className={!passwordMatch ? styles.inputError : ""}
          />
          <p
            className={styles.errorMessage}
            style={{ visibility: !passwordMatch ? "visible" : "hidden" }}
          >
            비밀번호가 일치하지 않습니다.
          </p>
        </div>

        {/* 에러 메시지 */}
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        {/* 가입 버튼 */}
        <button
          className={styles.signupButton}
          type="button"
          onClick={onSignup}
          disabled={isSignupButtonDisabled}
        >
          회원가입
        </button>

        <a href="/login" className={styles.registerLink}>
          로그인하기
        </a>
      </div>
    </div>
  );
};

export default Signup;
