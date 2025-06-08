// hooks/useAuth.js
import { useState, useEffect } from "react";

const useAuth = () => {
  const [isLogin, setIsLogin] = useState(!!sessionStorage.getItem("token"));

  useEffect(() => {
    const handleLogin = () => {
      setIsLogin(!!sessionStorage.getItem("token"));
    };

    window.addEventListener("login", handleLogin);
    window.addEventListener("logout", handleLogin);

    return () => {
      window.removeEventListener("login", handleLogin);
      window.removeEventListener("logout", handleLogin);
    };
  }, []);

  return [isLogin, setIsLogin];
};

export default useAuth;
