import { useEffect, useState } from "react";
import ProductListPage from "./productListPage";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const ProductListContainer = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const filter = searchParams.get("filter") || "latest";

  //페이지 변경시
  const onPageChange = (page: number) => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  };
  //필터 변경시
  const onFilterChange = (newFilter: string) => {
    searchParams.set("filter", newFilter);
    searchParams.set("page", "1"); // 정렬 바꾸면 페이지 1로 초기화
    setSearchParams(searchParams);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/product", {
          params: { page, filter },
        });
        console.log(res.data);
        setProducts(res.data.items);
        setCurrentPage(res.data.page);
        setTotalPage(res.data.totalPages);
      } catch (error: any) {
        alert(
          "상품 조회 실패: " + (error.response?.data?.message || error.message)
        );
      }
    };

    fetchProducts();
  }, [page, filter]);

  return (
    <ProductListPage
      products={products}
      currentPage={currentPage}
      totalPage={totalPage}
      onPageChanged={onPageChange}
      onFilterChanged={onFilterChange}
      currentFilter={filter}
    />
  );
};

export default ProductListContainer;
