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

const ProductDetailPage = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.content}>
        <div className={styles.detailWrap}>
          <div className={styles.productImg}>
            <img src={arrowLeft} alt="뒤로가기" className={styles.leftArrow} />

            <img
              className={styles.image}
              src="https://image.msscdn.net/thumbnails/images/goods_img/20250203/4752071/4752071_17388115773926_big.jpg?w=1200"
            />
            <img
              src={arrowRight}
              alt="뒤로가기"
              className={styles.rightArrow}
            />
          </div>
          <div className={styles.aboutProduct}>
            <span className={styles.title}>제품명제품명제품명</span>
            <div className={styles.price}>
              <div className={styles.priceNumber}>
                30,000
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
              <div className={styles.active}>판매중</div>
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
                125
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
                25
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
                10시간 전
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
                구로구
              </li>
              <li>
                <span style={{ marginRight: "81px" }}>카테고리</span>
                전자기기
              </li>
            </ul>
            <div className={styles.favoriteAndButton}>
              <img
                src={favoriteBorder}
                alt="조회수"
                width={39}
                height={39}
                style={{ marginRight: "25px" }}
              />
              <div className={styles.chatButton}>채팅하기</div>
            </div>
          </div>
        </div>
        <div className={styles.pagination}>
          <PageNation totalPages={2} currentPage={1} onPageChange={() => {}} />
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
            <span>
              개봉하지 않은 새 상품입니다.개봉하지 않은 새 상품입니다. 개봉하지
              않은 새 상품입니다. 개봉하지 않은 새 상품입니다. 개봉하지 않은 새
              상품입니다.
              <br /> <br /> 개봉하지 않은 새 상품입니다. 개봉하지 않은 새
              상품입니다. 개봉하지 않은 새 상품입니다.
            </span>
          </div>
          <div className={styles.sellerInfo}>
            <div className={styles.title} style={{ marginBottom: "24px" }}>
              판매자 정보
            </div>
            <div className={styles.sellerInfoDetail}>
              <div className={styles.sellerNickname}>
                <div className={styles.nickname}>내가 이 구역의 판매왕</div>
                <div className={styles.profile}>
                  <img
                    src="https://image.msscdn.net/thumbnails/images/goods_img/20250203/4752071/4752071_17388115773926_big.jpg?w=1200"
                    alt="프로필"
                  />
                </div>
              </div>
              <div className={styles.sellerProductsContainer}>
                <div className={styles.sellerProducts}>
                  <span style={{ fontSize: "16px", color: "#B9B9B9" }}>
                    전체
                  </span>
                  <span>15</span>
                </div>
                <span className={styles.separator} style={{ height: "20px" }} />

                <div className={styles.sellerProducts}>
                  <span style={{ fontSize: "16px", color: "#B9B9B9" }}>
                    판매중
                  </span>
                  <span>3</span>
                </div>
                <span className={styles.separator} style={{ height: "20px" }} />

                <div className={styles.sellerProducts}>
                  <span style={{ fontSize: "16px", color: "#B9B9B9" }}>
                    판매완료
                  </span>
                  <span>12</span>
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
