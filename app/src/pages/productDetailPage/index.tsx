import { useEffect, useState } from "react";
import ProductDetailPage from "./productDetailPage";
import { ProductDetailInfo } from "../../types/product";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductDetailPageContainer = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<ProductDetailInfo>();
  const [currentImageNum, setCurrentImageNum] = useState(1);

  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const navigate = useNavigate();

  const toggleStatusMenu = () => {
    setShowStatusMenu((prev) => !prev);
  };

  const onChangeStatus = async (newStatus: "판매중" | "판매완료") => {
    if (!productId || !product) return;
    const token = sessionStorage.getItem("token");

    try {
      await axios.put(
        `/api/product/update-status/${productId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProduct({ ...product, status: newStatus });
      setShowStatusMenu(false);
    } catch (err) {
      console.error("상태 변경 실패", err);
    }
  };

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

  const onClickDelete = async () => {
    if (!product || !productId) return;
    const token = sessionStorage.getItem("token");
    try {
      await axios.delete(`/api/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("상품이 삭제되었습니다.");
      navigate("/products"); // 삭제 후 상품 목록 페이지로 이동
    } catch (err) {
      console.error("상품 삭제 요청 실패", err);
      alert("상품 삭제에 실패했습니다.");
    }
  };

  return (
    <ProductDetailPage
      product={product}
      currentImageNum={currentImageNum}
      totalImageNum={product.images.length}
      onImageChange={onImageChange}
      onLikeToggle={onLikeToggle}
      showStatusMenu={showStatusMenu}
      toggleStatusMenu={toggleStatusMenu}
      onChangeStatus={onChangeStatus}
      onClickDelete={onClickDelete}
    />
  );
};

export default ProductDetailPageContainer;
