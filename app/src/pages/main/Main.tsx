import Footer from "../../components/Footer";
import PageNation from "../../components/pageNation/PageNation";
import Product from "../../components/product/Product";
import styles from "@/styles/pages/main.module.css";

import arrowRightGray from "@/assets/icon/arrowRightGray.png";
import { ProductInfo } from "../../types/product";
import data from "../../dummy-data/product.ts";

interface PropsType {
  totalPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Main = ({ totalPage, currentPage, onPageChange }: PropsType) => {
  return (
    <div className={styles.wrap}>
      <div className={styles.mainWrap}>
        <div className={styles.topAd}>
          <div className={styles.wrapAd}>
            <div className={styles.ad}></div>
            <div className={styles.ad}></div>
            <div className={styles.ad}></div>
          </div>
          <PageNation
            totalPages={totalPage}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
        <div className={styles.middleAd}></div>
        <div className={styles.productsWrap}>
          <div className={styles.top}>
            <div className={styles.title}>최근 올라온 상품</div>
            <div className={styles.all}>
              <div className={styles.text}>더보기</div>
              <img width={17} height={17} src={arrowRightGray} />
            </div>
          </div>
          <div className={styles.wrapProducts}>
            {data.map((item: ProductInfo) => (
              <Product data={item} />
            ))}
          </div>
          <PageNation
            totalPages={totalPage}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
        <div className={styles.productsWrap} style={{ marginTop: "50px" }}>
          <div className={styles.top}>
            <div style={{ display: "flex" }}>
              <div className={styles.title}>좋아요가 많은 상품</div>
              <div className={styles.subTitle}>
                사용자들이 많이 좋아요를 누른 상품을 보여드립니다.
              </div>
            </div>
            <div className={styles.all}>
              <div className={styles.text}>더보기</div>
              <img width={17} height={17} src={arrowRightGray} />
            </div>
          </div>
          <div className={styles.wrapProducts}>
            {data.map((item: ProductInfo) => (
              <Product data={item} />
            ))}
          </div>
          <PageNation
            totalPages={totalPage}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
        <div className={styles.productsWrap} style={{ marginTop: "50px" }}>
          <div className={styles.top}>
            <div style={{ display: "flex" }}>
              <div className={styles.title}>조회수가 많은 상품</div>
              <div className={styles.subTitle}>
                사용자들이 많이 조회한 상품을 보여드립니다.{" "}
              </div>
            </div>
            <div className={styles.all}>
              <div className={styles.text}>더보기</div>
              <img width={17} height={17} src={arrowRightGray} />
            </div>
          </div>
          <div className={styles.wrapProducts}>
            {data.map((item: ProductInfo) => (
              <Product data={item} />
            ))}
          </div>
          <PageNation
            totalPages={totalPage}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Main;
