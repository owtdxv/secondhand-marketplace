import { useState, useEffect } from "react";
import axios from "axios";
import { User } from "../types/user";

const useAuthUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setUser(response.data))
      .catch(() => {
        sessionStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));

    const handleLogout = () => {
      sessionStorage.removeItem("token");
      setUser(null);
    };

    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  return { user, loading, setUser };
};

export default useAuthUser;
