import { useState } from "react";
import Main from "./Main";

const MainContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <Main totalPage={5} currentPage={currentPage} onPageChange={onPageChange} />
  );
};

export default MainContainer;
