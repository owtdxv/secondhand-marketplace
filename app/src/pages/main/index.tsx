import { useEffect, useState } from "react";
import Main from "./Main";
import axios from "axios";
import { getProductResponse } from "../../types/product";

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
        console.log(res.data);
        setRecentData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`/api/product/top-view?page=${topViewPage}`)
      .then((res) => {
        console.log(res);
        setTopViewData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`/api/product/top-like?page=${topLikePage}`)
      .then((res) => {
        console.log(res);
        setTopLikeData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [recentPage]);
  return (
    <Main
      recentData={recentData}
      topViewData={topViewData}
      topLikeData={topLikeData}
      onTopViewPageChange={onTopViewPageChange}
      onRecentPageChange={onRecentPageChange}
      onTopLikePageChange={onTopLikePageChange}
    />
  );
};

export default MainContainer;
