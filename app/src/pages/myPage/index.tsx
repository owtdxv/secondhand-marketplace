import { useNavigate, useSearchParams } from "react-router-dom";
import MyPage from "./MyPage";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserInfo } from "../../types/user";

const MyPageContainer = () => {
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const [page, setPage] = useState<string>("my-product");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("latest");
  const [nickName, setNickName] = useState<string>();
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [uid, setUid] = useState("");

  useEffect(() => {
    if (!token) {
      alert("로그인 후 이용 가능한 컨텐츠입니다.");
      navigate("/login");
      return;
    }
    // 먼저 /auth/me로 내 ID 조회
    axios
      .get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // 이후 내 ID로 유저 상세정보 요청
        setUid(res.data._id);
        return axios.get(`/api/users/${res.data._id}`);
      })
      .then((res) => {
        setUserInfo(res.data);
        setNickName(res.data.displayName);
      })
      .catch((err) => {
        alert("유저 정보 조회에 실패했습니다.");
      });
  }, []);

  const handleEditMode = () => {
    setEditMode(!editMode);
  };

  //페이지 변경시
  const onChangePage = (page: string) => {
    setFilter("latest");
    setPage(page);
  };
  //필터 변경시
  const onChangeFilter = (newFilter: string) => {
    setFilter(newFilter);
  };

  const fetchProducts = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: page === "recent-view" ? "" : { filter }, // 모든 요청에 공통으로 filter 적용
    };

    try {
      let res;

      if (page === "my-product") {
        res = await axios.get(`/api/users/product/sold/${uid}`, config);
      } else if (page === "liked-product") {
        res = await axios.get(`/api/users/${uid}/likes`, config);
      } else {
        res = await axios.get(`/api/users/${uid}/views`, config);
      }
      console.log(res.data);
      setProducts(res.data.items);
    } catch (error: any) {
      alert(
        "상품 조회 실패: " + (error.response?.data?.message || error.message)
      );
    }
  };

  useEffect(() => {
    if (!uid) return; // uid 없으면 fetchProducts 실행하지 않음
    fetchProducts();
  }, [page, uid, filter]);

  //엔터 클릭 시 작동되는 함수
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      axios
        .put(
          "/api/users/edit/displayname",
          { displayName: nickName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          alert("닉네임 변경 성공!");
        })
        .catch(() => {
          alert("변경 실패");
        });
      setEditMode(false);
    }
  };

  const onChangeNickName = (e: any) => {
    setNickName(e);
  };

  if (!token) {
    return <div>Loading...</div>;
  }

  return (
    <MyPage
      data={products}
      page={page}
      userInfo={userInfo}
      editMode={editMode}
      filter={filter}
      handleEditMode={handleEditMode}
      onChangePage={onChangePage}
      onChangeFilter={onChangeFilter}
      handleKeyDown={handleKeyDown}
      nickName={nickName}
      onChangeNickName={onChangeNickName}
    />
  );
};

export default MyPageContainer;
