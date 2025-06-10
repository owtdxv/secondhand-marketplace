import styles from "../../styles/pages/productDetailPage.module.css";
import arrowLeft from "@/assets/icon/arrowLeft.png";
import arrowRight from "@/assets/icon/arrowRight.png";
import eye from "@/assets/icon/eye.png";
import time from "@/assets/icon/time.png";
import favorite from "@/assets/icon/Favorite.png";
import favoriteBorder from "@/assets/icon/FavoriteBorder.png";
import favoriteBorderGreen from "@/assets/icon/FavoriteBorderGreen.png";
import location from "@/assets/icon/Location on.png";
import PageNation from "../../components/pageNation/PageNation";
import { ProductDetailInfo } from "../../types/product";

interface PropsType {
  product: ProductDetailInfo;
  currentImageNum: number;
  totalImageNum: number;
  onImageChange: (imageNum: number) => void;
  onLikeToggle: () => void;
  showStatusMenu: boolean;
  toggleStatusMenu: () => void;
  onChangeStatus: (newStatus: "판매중" | "판매완료") => void;
  onClickDelete: () => void;
  onClickChat: () => void;
}
const ProductDetailPage = ({
  product,
  currentImageNum,
  totalImageNum,
  onImageChange,
  onLikeToggle,
  showStatusMenu,
  toggleStatusMenu,
  onChangeStatus,
  onClickDelete,
  onClickChat,
}: PropsType) => {
  return (
    <div className={styles.wrap}>
      <div className={styles.content}>
        <div className={styles.detailWrap}>
          <div className={styles.productImg}>
            <img
              src={arrowLeft}
              alt="뒤로가기"
              className={styles.leftArrow}
              onClick={() => {
                if (currentImageNum > 1) {
                  onImageChange(currentImageNum - 1);
                }
              }}
            />

            <img
              className={styles.image}
              src={product.images[currentImageNum - 1]}
            />
            <img
              src={arrowRight}
              alt="뒤로가기"
              className={styles.rightArrow}
              onClick={() => {
                if (currentImageNum < totalImageNum) {
                  onImageChange(currentImageNum + 1);
                }
              }}
            />
          </div>
          <div className={styles.aboutProduct}>
            <span className={styles.title}>{product.name}</span>
            <div className={styles.price}>
              <div className={styles.priceNumber}>
                {product.price.toLocaleString()}
                <span
                  style={{
                    marginLeft: "5px",
                    fontSize: "24px",
                    fontWeight: "normal",
                    marginRight: "66px",
                  }}
                >
                  원
                </span>
              </div>
              {product.status === "판매중" ? (
                <div
                  className={styles.active_ing}
                  onClick={product.isMine ? toggleStatusMenu : undefined}
                >
                  판매중
                  {showStatusMenu && (
                    <div className={styles.statusDropdown}>
                      <div
                        className={styles.active_ing}
                        onClick={() => onChangeStatus("판매중")}
                      >
                        판매중
                      </div>
                      <div
                        onClick={() => onChangeStatus("판매완료")}
                        className={styles.active_end}
                      >
                        판매완료
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={styles.active_end}
                  onClick={product.isMine ? toggleStatusMenu : undefined}
                >
                  판매 완료
                  {showStatusMenu && (
                    <div className={styles.statusDropdown}>
                      <div
                        onClick={() => onChangeStatus("판매중")}
                        className={styles.active_ing}
                      >
                        판매중
                      </div>
                      <div
                        onClick={() => onChangeStatus("판매완료")}
                        className={styles.active_end}
                      >
                        판매완료
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className={styles.underline}></div>
            <div className={styles.status}>
              <span className={styles.statusContent}>
                <img
                  src={favorite}
                  alt="좋이요"
                  width={25}
                  height={25}
                  style={{ marginRight: "6px" }}
                />
                {product.likes}
              </span>
              <span className={styles.separator}></span>
              <span className={styles.statusContent}>
                <img
                  src={eye}
                  alt="조회수"
                  width={25}
                  height={25}
                  style={{ marginRight: "6px" }}
                />
                {product.views}
              </span>
              <span className={styles.separator}></span>
              <span className={styles.statusContent}>
                <img
                  src={time}
                  alt="시간"
                  width={25}
                  height={25}
                  style={{ marginRight: "6px" }}
                />
                {product.lastUpdated}
              </span>
            </div>
            <ul className={styles.ul}>
              <li style={{ marginBottom: "12px" }}>
                <span style={{ marginRight: "63.75px" }}>거래희망지역</span>
                <img
                  src={location}
                  alt="위치"
                  width={18}
                  height={18}
                  style={{ marginRight: "5px" }}
                />
                {product.saleRegion}
              </li>
              <li>
                <span style={{ marginRight: "81px" }}>카테고리</span>
                {product.category}
              </li>
            </ul>
            <div className={styles.favoriteAndButton}>
              <img
                src={product.isLiked ? favoriteBorderGreen : favoriteBorder}
                alt="조회수"
                width={39}
                height={39}
                style={{ marginRight: "25px" }}
                onClick={onLikeToggle}
              />
              {product.isMine ? (
                <div className={styles.buttonDiv}>
                  <div className={styles.updateButton}>수정하기</div>
                  <div className={styles.deleteButton} onClick={onClickDelete}>
                    삭제하기
                  </div>
                </div>
              ) : (
                <div className={styles.chatButton} onClick={onClickChat}>
                  채팅하기
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.pagination}>
          <PageNation
            totalPages={totalImageNum}
            currentPage={currentImageNum}
            onPageChange={onImageChange}
          />
        </div>
        <div className={styles.descriptionWrap}>
          <div className={styles.description}>
            <div className={styles.title} style={{ marginBottom: "24px" }}>
              상품 설명
            </div>
            <div
              className={styles.underline}
              style={{ marginBottom: "34px" }}
            />
            <span>{product.description}</span>
          </div>
          <div className={styles.sellerInfo}>
            <div className={styles.title} style={{ marginBottom: "24px" }}>
              판매자 정보
            </div>
            <div className={styles.sellerInfoDetail}>
              <div className={styles.sellerNickname}>
                <div className={styles.nickname}>
                  {product.seller.displayName}
                </div>
                <div className={styles.profile}>
                  <img
                    src={
                      product.seller.profileImage
                        ? product.seller.profileImage
                        : "https://image.msscdn.net/thumbnails/images/prd_img/20250203/4752071/detail_4752071_17388115837024_big.jpg?w=1200"
                    }
                    alt="프로필"
                  />
                </div>
              </div>
              <div className={styles.sellerProductsContainer}>
                <div className={styles.sellerProducts}>
                  <span style={{ fontSize: "16px", color: "#B9B9B9" }}>
                    전체
                  </span>
                  <span>
                    {product.seller.onSaleCount + product.seller.soldOutCount}
                  </span>
                </div>
                <span className={styles.separator} style={{ height: "20px" }} />

                <div className={styles.sellerProducts}>
                  <span style={{ fontSize: "16px", color: "#B9B9B9" }}>
                    판매중
                  </span>
                  <span>{product.seller.onSaleCount}</span>
                </div>
                <span className={styles.separator} style={{ height: "20px" }} />

                <div className={styles.sellerProducts}>
                  <span style={{ fontSize: "16px", color: "#B9B9B9" }}>
                    판매완료
                  </span>
                  <span>{product.seller.soldOutCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
