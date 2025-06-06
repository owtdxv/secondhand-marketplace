import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login"; // UI 컴포넌트 임포트

const LoginContainer = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoginButtonEnabled, setIsLoginButtonEnabled] = useState(false);
  const navigate = useNavigate();

  // 이미 로그인 된 경우 접근 차단
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { accessToken } = event.data;
      if (accessToken) {
        sessionStorage.setItem("token", accessToken);
        console.log("로그인 dispatchEvent");
        window.dispatchEvent(new Event("login"));
      }

      navigate("/");
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // 이메일과 비밀번호 입력 시 로그인 버튼 활성화 여부 결정
  useEffect(() => {
    setIsLoginButtonEnabled(email.length > 0 && password.length > 0);
  }, [email, password]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value.length > 0 && emailError) {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value.length > 0 && passwordError) {
      setPasswordError("");
    }
  };

  const handleLogin = async () => {
    let hasError = false;

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

    if (!password) {
      setPasswordError("비밀번호를 입력해주세요.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) {
      return;
    }

    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });
      const { accessToken } = res.data;
      sessionStorage.setItem("token", accessToken);
      console.log("로그인 dispatchEvent");
      window.dispatchEvent(new Event("login"));
      navigate("/");
    } catch (error: any) {
      if (error.response?.status === 401) {
        setEmailError("이메일 또는 비밀번호가 올바르지 않습니다.");
        setPasswordError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        alert("로그인 실패: " + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleNaverLogin = async () => {
    const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      import.meta.env.VITE_NAVER_REDIRECT_URI
    );
    const state = Math.random().toString(36).substring(2, 15); // CSRF 보호용

    const authUrl =
      `https://nid.naver.com/oauth2.0/authorize` +
      `?response_type=code&client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&state=${state}`;

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      authUrl,
      "naverLogin",
      `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=yes`
    );
  };

  return (
    <Login
      email={email}
      password={password}
      emailError={emailError}
      passwordError={passwordError}
      isLoginButtonEnabled={isLoginButtonEnabled}
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      onLogin={handleLogin}
      onNaverLogin={handleNaverLogin}
    />
  );
};

export default LoginContainer;
