import { useNavigate } from "react-router-dom";
import MyPage from "./MyPage";

const MyPageContainer = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  if (!token) {
    navigate("/login");
  }

  return <MyPage />;
};

export default MyPageContainer;
