import styles from "@/styles/pages/myPage.module.css";
import { ProductInfo } from "../../types/product";
import Product from "../../components/product/Product";

interface PropsType {
  data: ProductInfo[];
  title: string;
  filter?: string;
  onChangeFilter?: (filter: string) => void;
}

const MyProduct = ({ data, title, filter, onChangeFilter }: PropsType) => {
  return (
    <div className={styles.myProductWrap}>
      <div className={styles.myPageTitle}>{title}</div>
      {title === "최근 본 상품" ? null : (
        <p className={styles.product}>
          상품 <span className={styles.redText}>10</span>
        </p>
      )}
      <hr className={styles.line} />
      {title === "최근 본 상품" ? null : (
        <div className={styles.filter}>
          <div
            style={{ color: filter === "Recent" ? "black" : "#d9d9d9" }}
            onClick={() => {
              onChangeFilter?.("Recent");
            }}
          >
            최신순
          </div>
          <div className={styles.verticalShort}></div>
          <div
            style={{ color: filter === "rowCosts" ? "black" : "#d9d9d9" }}
            onClick={() => {
              onChangeFilter?.("rowCosts");
            }}
          >
            낮은 가격순
          </div>
          <div className={styles.verticalShort}></div>
          <div
            style={{ color: filter === "highCosts" ? "black" : "#d9d9d9" }}
            onClick={() => {
              onChangeFilter?.("highCosts");
            }}
          >
            높은 가격순
          </div>
        </div>
      )}

      <div className={styles.wrapItems}>
        {data ? (
          data.map((item) => <Product data={item} />)
        ) : (
          <div>상품이 없습니다</div>
        )}
      </div>
    </div>
  );
};

export default MyProduct;
