import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Signup from "./Signup";

const SignupContainer = () => {
  const navigate = useNavigate();

  // 이미 로그인 된 경우 접근 차단
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  return <Signup />;
};

export default SignupContainer;
