import PageNation from "../../components/pageNation/PageNation";
import Product from "../../components/product/Product";
import styles from "../../styles/pages/main.module.css";

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
        <div>
          <div>
            <h1>최근 올라온 상품</h1>
            <p>
              더보기
              <img width={17} src={arrowRightGray} />
            </p>
          </div>
          <div>
            <Product />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
