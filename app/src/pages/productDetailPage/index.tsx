import { useEffect, useState } from "react";
import ProductDetailPage from "./productDetailPage";
import { ProductDetailInfo } from "../../types/product";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetailPageContainer = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<ProductDetailInfo>();
  const [currentImageNum, setCurrentImageNum] = useState(1);

  useEffect(() => {
    if (!productId) return;
    const token = sessionStorage.getItem("token");

    axios
      .get(`/api/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProduct(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error("상품 조회 실패", err);
      });
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  const onImageChange = (imageNum: number) => {
    console.log("이미지 배열", product.images);
    console.log("현재 이미지 인덱스", imageNum);
    setCurrentImageNum(imageNum);
  };

  const onLikeToggle = async () => {
    if (!product || !productId) return;
    const token = sessionStorage.getItem("token");
    try {
      await axios.put(`/api/product/add-like/${productId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // 좋아요 상태 반영
      setProduct((prev) =>
        prev
          ? {
              ...prev,
              isLiked: !prev.isLiked,
              likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
            }
          : prev
      );
    } catch (err) {
      console.error("좋아요 요청 실패", err);
    }
  };

  return (
    <ProductDetailPage
      product={product}
      currentImageNum={currentImageNum}
      totalImageNum={product.images.length}
      onImageChange={onImageChange}
      onLikeToggle={onLikeToggle}
    />
  );
};

export default ProductDetailPageContainer;
