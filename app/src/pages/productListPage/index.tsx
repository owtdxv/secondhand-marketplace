import { useEffect, useState } from "react";
import ProductListPage from "./productListPage";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const ProductListContainer = () => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const filter = searchParams.get("filter") || "latest";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/product", {
          params: { page, filter },
        });
        console.log(res.data.items);
        setProducts(res.data.items);
      } catch (error: any) {
        alert(
          "상품 조회 실패: " + (error.response?.data?.message || error.message)
        );
      }
    };

    fetchProducts();
  }, [page, filter]);

  return <ProductListPage products={products} />;
};

export default ProductListContainer;
