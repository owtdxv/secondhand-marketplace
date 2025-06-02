import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "@/styles/pages/signup.module.css";
import Logo from "@/assets/Logo_full.png";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [emailCheckResult, setEmailCheckResult] = useState<null | boolean>(
    null
  );
  const [nameCheckResult, setNameCheckResult] = useState<null | boolean>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const isValidPassword = (pw: string) => {
    // 영문자, 숫자, 특수문자 포함 8~16자
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,16}$/;
    return regex.test(pw);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(password === value);
  };

  const checkEmailDuplicate = async () => {
    if (!email) return;
    try {
      const response = await axios.get(
        `/api/auth/check-email?email=${encodeURIComponent(email)}`
      );
      setEmailCheckResult(response.data.isDuplicate);
    } catch {
      setEmailCheckResult(null);
    }
  };

  const checkNameDuplicate = async () => {
    if (!displayName) return;
    try {
      const response = await axios.get(
        `/api/auth/check-name?displayName=${encodeURIComponent(displayName)}`
      );
      setNameCheckResult(response.data.isDuplicate);
    } catch {
      setNameCheckResult(null);
    }
  };

  const handleSignup = async () => {
    setErrorMessage("");

    if (emailCheckResult !== false) {
      setErrorMessage("이메일 중복여부를 확인해 주세요.");
      return;
    }

    if (nameCheckResult !== false) {
      setErrorMessage("닉네임 중복여부를 확인해 주세요.");
      return;
    }

    if (!passwordValid) {
      setErrorMessage(
        "비밀번호는 영문, 숫자, 특수문자를 포함하여 8~16자여야 합니다."
      );
      return;
    }

    if (!passwordMatch) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post("/api/auth/signup", {
        email,
        password,
        displayName,
      });

      if (response.status === 201 || response.status === 200) {
        navigate("/signup-complete");
      }
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;
      if (status === 409) {
        setErrorMessage(message);
      } else {
        setErrorMessage("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

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
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailCheckResult(null);
              }}
              className={emailCheckResult === true ? styles.inputError : ""}
            />
            <button
              type="button"
              onClick={checkEmailDuplicate}
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
                : styles.successMessage
            }
          >
            {emailCheckResult === true && "이미 사용 중인 이메일입니다."}
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
              onChange={(e) => {
                setDisplayName(e.target.value);
                setNameCheckResult(null);
              }}
              className={nameCheckResult === true ? styles.inputError : ""}
            />
            <button
              type="button"
              onClick={checkNameDuplicate}
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
                : styles.successMessage
            }
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
            onChange={(e) => {
              const value = e.target.value;
              setPassword(value);
              setPasswordMatch(value === confirmPassword);
              setPasswordValid(isValidPassword(value));
            }}
            className={
              !passwordMatch || !passwordValid ? styles.inputError : ""
            }
          />
          <p className={styles.errorMessage}>
            {!passwordValid &&
              "비밀번호는 영문, 숫자, 특수문자를 포함하여 8~16자여야 합니다."}
          </p>
        </div>

        {/* 비밀번호 확인 */}
        <div className={styles.inputGroup}>
          <label>비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호를 한번 더 입력해주세요."
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={!passwordMatch ? styles.inputError : ""}
          />
          <p className={styles.errorMessage}>
            {!passwordMatch && "비밀번호가 일치하지 않습니다."}
          </p>
        </div>

        {/* 에러 메시지 */}
        <p className={styles.errorMessage}>{errorMessage}</p>

        {/* 가입 버튼 */}
        <button
          className={styles.signupButton}
          type="button"
          onClick={handleSignup}
          disabled={
            !email ||
            !displayName ||
            !password ||
            !confirmPassword ||
            !passwordMatch ||
            !passwordValid ||
            emailCheckResult !== false ||
            nameCheckResult !== false
          }
        >
          회원가입
        </button>

        <a href="/login" className={styles.registerLink}>
          로그인 하기
        </a>
      </div>
    </div>
  );
};

export default Signup;
