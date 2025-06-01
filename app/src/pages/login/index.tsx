import { useNavigate } from "react-router-dom";
import Login from "./Login";
import { useEffect } from "react";

const LoginContainer = () => {
  const navigate = useNavigate();

  // 이미 로그인 된 경우 접근 차단
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  return <Login />;
};

export default LoginContainer;
