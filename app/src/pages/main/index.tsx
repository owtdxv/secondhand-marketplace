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
  const [recentPage, setRecentPage] = useState(1);

  const onRecentPageChange = (page: number) => {
    setRecentPage(page);
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
  }, [recentPage]);
  return (
    <Main recentData={recentData} onRecentPageChange={onRecentPageChange} />
  );
};

export default MainContainer;
