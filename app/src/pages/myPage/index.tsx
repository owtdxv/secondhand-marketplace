import { useNavigate } from "react-router-dom";
import MyPage from "./MyPage";
import { useEffect, useState } from "react";

export const data = [
  {
    _id: "djjdd",
    name: "dummy",
    price: 30000,
    images: ["http"],
    lastUpdated: "1시간전",
  },
  {
    _id: "djjdd",
    name: "dummy",
    price: 30000,
    images: ["http"],
    lastUpdated: "1시간전",
  },
  {
    _id: "djjdd",
    name: "dummy",
    price: 30000,
    images: ["http"],
    lastUpdated: "1시간전",
  },
  {
    _id: "djjdd",
    name: "dummy",
    price: 30000,
    images: ["http"],
    lastUpdated: "1시간전",
  },
  {
    _id: "djjdd",
    name: "dummy",
    price: 30000,
    images: ["http"],
    lastUpdated: "1시간전",
  },
  {
    _id: "djjdd",
    name: "dummy",
    price: 30000,
    images: ["http"],
    lastUpdated: "1시간전",
  },
];

const MyPageContainer = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [page, setPage] = useState<string>("my-product");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>();

  useEffect(() => {
    if (!token) {
      alert("로그인 후 이용 가능한 컨텐츠입니다.");
      navigate("/login");
    }
  }, []);

  const handleEditMode = () => {
    setEditMode(!editMode);
    console.log(editMode);
  };

  const onChangePage = (page: string) => {
    setPage(page);
  };

  if (!token) {
    return <div>Loading...</div>;
  }

  return (
    <MyPage
      data={data}
      page={page}
      editMode={editMode}
      handleEditMode={handleEditMode}
      onChangePage={onChangePage}
    />
  );
};

export default MyPageContainer;
