// hooks/useAuth.js
import { useState, useEffect, Dispatch, SetStateAction } from "react";

const useAuth = (): [boolean, Dispatch<SetStateAction<boolean>>] => {
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
