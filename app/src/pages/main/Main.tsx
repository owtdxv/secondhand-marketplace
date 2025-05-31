import Footer from "../../components/Footer";
import PageNation from "../../components/pageNation/PageNation";
import Product from "../../components/product/Product";
import styles from "@/styles/pages/main.module.css";

import arrowRightGray from "@/assets/icon/arrowRightGray.png";

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
          <div>
            <Product />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Main;
