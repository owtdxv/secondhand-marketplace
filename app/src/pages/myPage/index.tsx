import { useNavigate } from "react-router-dom";
import MyPage from "./MyPage";
import React, { useEffect, useState } from "react";

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
  const [nickName, setNickName] = useState<string>("내가 이 구역 판매왕");

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

  const onChangeFilter = (filter: string) => {
    setFilter(filter);
  };

  //엔터 클릭 시 작동되는 함수
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setEditMode(false);
      //엔터 시 작동 상황을 이곳에 기재
    }
  };

  const onChangeNickName = (e: any) => {
    setNickName(e);
    console.log(nickName);
  };

  if (!token) {
    return <div>Loading...</div>;
  }

  return (
    <MyPage
      data={data}
      page={page}
      editMode={editMode}
      filter={filter}
      nickName={nickName}
      handleEditMode={handleEditMode}
      onChangePage={onChangePage}
      onChangeFilter={onChangeFilter}
      handleKeyDown={handleKeyDown}
      onChangeNickName={onChangeNickName}
    />
  );
};

export default MyPageContainer;
