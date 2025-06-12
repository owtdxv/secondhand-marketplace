import { useEffect, useState } from "react";
import Main from "./Main";
import axios from "axios";
import {
  getProductResponse,
  getRecommendProductResponse,
} from "../../types/product";
import { User } from "../../types/user";

const MainContainer = () => {
  const [recentData, setRecentData] = useState<getProductResponse>({
    page: 1,
    totalPages: 1,
    items: [],
  });
  const [topViewData, setTopViewData] = useState({
    page: 1,
    totalPages: 1,
    items: [],
  });
  const [topLikeData, setTopLikeData] = useState({
    page: 1,
    totalPages: 1,
    items: [],
  });
  const [recommendData, setRecommendData] =
    useState<getRecommendProductResponse>({
      items: [],
    });
  const [user, setUser] = useState<User | null>(null);

  const [recentPage, setRecentPage] = useState(1);
  const [topViewPage, setTopViewPage] = useState(1);
  const [topLikePage, setTopLikePage] = useState(1);

  const onRecentPageChange = (page: number) => {
    setRecentPage(page);
  };

  const onTopViewPageChange = (page: number) => {
    setTopViewPage(page);
  };

  const onTopLikePageChange = (page: number) => {
    setTopLikePage(page);
  };

  useEffect(() => {
    axios
      .get(`/api/product/recent?page=${recentPage}`)
      .then((res) => {
        setRecentData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`/api/product/top-view?page=${topViewPage}`)
      .then((res) => {
        setTopViewData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`/api/product/top-like?page=${topLikePage}`)
      .then((res) => {
        setTopLikeData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [recentPage, topLikePage, topViewPage]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      axios
        .get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log("사용자 정보 가져오기 실패: ", err);
        });
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const token = sessionStorage.getItem("token");
    axios
      .get(`/api/product/recommend/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRecommendData({ items: res.data });
      })
      .catch((err) => {
        console.log("추천 상품 가져오기 실패: ", err);
      });
  }, [user]);
  return (
    <Main
      recentData={recentData}
      topViewData={topViewData}
      topLikeData={topLikeData}
      onTopViewPageChange={onTopViewPageChange}
      onRecentPageChange={onRecentPageChange}
      onTopLikePageChange={onTopLikePageChange}
      user={user}
      recommendData={recommendData}
    />
  );
};

export default MainContainer;
