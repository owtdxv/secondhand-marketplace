import { useEffect, useState } from "react";
import { ProductInfo } from "../../types/product";
import { useSearchParams } from "react-router-dom";
import SearchProductPage from "./searchProductPage";
import axios from "axios";

const SearchProductContainer = () => {
  const [products, setProducts] = useState<ProductInfo[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalProduct, setTotalProduct] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const input = searchParams.get("input") || "";
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
        const token = sessionStorage.getItem("token");
        const res = await axios.get("/api/product/search", {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, filter, input },
        });
        console.log(res.data);
        setProducts(res.data.items);
        setCurrentPage(res.data.page);
        setTotalPage(res.data.totalPages);
        setTotalProduct(res.data.totalProduct);
      } catch (error: any) {
        alert(
          "상품 조회 실패: " + (error.response?.data?.message || error.message)
        );
      }
    };

    fetchProducts();
  }, [page, filter, input]);

  return (
    <SearchProductPage
      products={products}
      input={input}
      currentPage={currentPage}
      totalPage={totalPage}
      totalProduct={totalProduct}
      onPageChanged={onPageChange}
      onFilterChanged={onFilterChange}
      currentFilter={filter}
    />
  );
};

export default SearchProductContainer;
