import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Signup from "./Signup";
import { SignupProps } from "../../types/auth";

const SignupContainer = () => {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true); // 초기값을 true로 하여 처음에는 에러 안 보이게
  const [emailCheckResult, setEmailCheckResult] = useState<boolean | null>(
    null
  );
  const [nameCheckResult, setNameCheckResult] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // 이미 로그인 된 경우 접근 차단
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const isValidPassword = useCallback((pw: string) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,16}$/;
    return regex.test(pw);
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailCheckResult(null); // 이메일 변경 시 중복 검사 결과 초기화
    setErrorMessage(""); // 주요 입력 변경 시 에러 메시지 초기화
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
    setNameCheckResult(null); // 닉네임 변경 시 중복 검사 결과 초기화
    setErrorMessage("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordValid(isValidPassword(newPassword));
    setPasswordMatch(newPassword === confirmPassword);
    setErrorMessage("");
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordMatch(password === newConfirmPassword);
    setErrorMessage("");
  };

  const checkEmailDuplicate = async () => {
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailCheckResult(true); // 검사 결과 초기화
      return;
    }

    setErrorMessage("");
    try {
      const response = await axios.get(
        `/api/auth/check-email?email=${encodeURIComponent(email)}`
      );
      setEmailCheckResult(response.data.isDuplicate); // API 응답에 따라 true (중복) 또는 false (사용 가능)
    } catch (error) {
      setEmailCheckResult(null); // 에러 발생 시 알 수 없음 상태
      setErrorMessage("이메일 중복 검사 중 오류가 발생했습니다.");
    }
  };

  const checkNameDuplicate = async () => {
    if (!displayName) return;
    setErrorMessage("");
    try {
      const response = await axios.get(
        `/api/auth/check-name?displayName=${encodeURIComponent(displayName)}`
      );
      setNameCheckResult(response.data.isDuplicate); // API 응답에 따라 true (중복) 또는 false (사용 가능)
    } catch (error) {
      setNameCheckResult(null); // 에러 발생 시 알 수 없음 상태
      setErrorMessage("닉네임 중복 검사 중 오류가 발생했습니다.");
    }
  };

  const handleSignup = async () => {
    setErrorMessage(""); // 시도 시 이전 에러 메시지 초기화

    if (emailCheckResult !== false) {
      setErrorMessage(
        "이메일 중복 확인이 필요하거나 이미 사용 중인 이메일입니다."
      );
      return;
    }
    if (nameCheckResult !== false) {
      setErrorMessage(
        "닉네임 중복 확인이 필요하거나 이미 사용 중인 닉네임입니다."
      );
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
    if (!email || !displayName || !password || !confirmPassword) {
      setErrorMessage("모든 필드를 입력해주세요.");
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
      const message =
        error.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
      setErrorMessage(message);
    }
  };

  const isSignupButtonDisabled =
    !email ||
    !displayName ||
    !password ||
    !confirmPassword ||
    !passwordMatch ||
    !passwordValid ||
    emailCheckResult !== false || // 이메일이 사용 가능(false)해야 함
    nameCheckResult !== false; // 닉네임이 사용 가능(false)해야 함

  const signupProps: SignupProps = {
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
    onEmailChange: handleEmailChange,
    onDisplayNameChange: handleDisplayNameChange,
    onPasswordChange: handlePasswordChange,
    onConfirmPasswordChange: handleConfirmPasswordChange,
    onCheckEmailDuplicate: checkEmailDuplicate,
    onCheckNameDuplicate: checkNameDuplicate,
    onSignup: handleSignup,
  };

  return <Signup {...signupProps} />;
};

export default SignupContainer;
