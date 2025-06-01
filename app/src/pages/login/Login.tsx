import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력하세요");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식을 입력하세요");
      return;
    }

    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const { accessToken } = res.data;

      // 토큰 저장
      sessionStorage.setItem("token", accessToken);

      navigate("/");
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert("이메일 또는 비밀번호가 올바르지 않습니다");
      } else {
        alert("로그인 실패: " + (error.response?.data?.error || error.message));
      }
    }
  };

  return (
    <div>
      <div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
        />
        <button onClick={handleLogin}>로그인</button>
      </div>
    </div>
  );
};

export default Login;
