import { useEffect, useState } from "react";
import ProductDetailPage from "./productDetailPage";
import { ProductDetailInfo } from "../../types/product";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/user";

const ProductDetailPageContainer = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<ProductDetailInfo>();
  const [currentImageNum, setCurrentImageNum] = useState(1);
  const [user, setUser] = useState<User | null>(null);

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

  const onClickChat = async () => {
    if (!user) {
      alert("로그인이 필요한 서비스입니다");
      return;
    }
    if (!product) return; // product가 없을 경우를 대비

    const token = sessionStorage.getItem("token");
    try {
      await axios
        .post(
          "/api/chat/newchat",
          {
            participants: [user._id, product.sellerId],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          window.dispatchEvent(new Event("openChatWidgetRequest"));
        });
    } catch (err) {
      alert("해당 사용자와 채팅할 수 없습니다!");
      console.error("채팅방 생성 오류", err);
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
        console.log(res.data);
        setProduct(res.data);
      })
      .catch((err) => {
        console.error("상품 조회 실패", err);
      });
  }, [productId]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    axios
      .get("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
      });
  }, []);

  if (!product) return <div>Loading...</div>;

  const onImageChange = (imageNum: number) => {
    setCurrentImageNum(imageNum);
  };

  const onLikeToggle = async () => {
    if (!product || !productId) return;
    if (!user) {
      // product.isUser 대신 user 상태를 직접 확인하는 것이 더 명확합니다.
      alert("로그인이 필요한 서비스입니다.");
      return;
    }
    const token = sessionStorage.getItem("token");
    try {
      await axios
        .put(`/api/product/add-like/${productId}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log(res.data);
          setProduct({
            ...product,
            isLiked: res.data.isLiked,
            likes: res.data.likes,
          });
        });
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
      navigate("/products");
    } catch (err) {
      console.error("상품 삭제 요청 실패", err);
      alert("상품 삭제에 실패했습니다.");
    }
  };

  const onClickEditMode = () => {
    navigate(`/update-product/${productId}`);
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
      onClickEditMode={onClickEditMode}
      onClickChat={onClickChat}

    />
  );
};

export default ProductDetailPageContainer;
