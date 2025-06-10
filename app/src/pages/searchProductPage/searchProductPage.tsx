import { ProductInfo } from "../../types/product";
import styles from "../../styles/pages/searchProductPage.module.css";
import Product from "../../components/product/Product";
import PageNationNum from "../../components/pageNation/PageNationNum";

interface PropsType {
  products: ProductInfo[];
  input: string;
  currentPage: number;
  totalPage: number;
  totalProduct: number;
  onPageChanged: (page: number) => void;
  onFilterChanged: (filter: string) => void;
  currentFilter: string;
}

const SearchProductPage = ({
  products,
  input,
  currentPage,
  totalPage,
  totalProduct,
  onPageChanged,
  onFilterChanged,
  currentFilter,
}: PropsType) => {
  return (
    <div>
      <div className={styles.wrap}>
        <div className={styles.content}>
          <div className={styles.titleWrap}>
            <span className={styles.title}>
              <span style={{ fontWeight: "bold" }}>'{input}'</span> 검색 결과
            </span>
            <span className={styles.countTitle}>총 {totalProduct}개</span>
          </div>
          <div className={styles.filter}>
            <span
              onClick={() => onFilterChanged("latest")}
              className={styles.sortItem}
              style={currentFilter === "latest" ? { color: "black" } : {}}
            >
              최신순
            </span>
            <span
              onClick={() => onFilterChanged("price_asc")}
              className={styles.sortItem}
              style={currentFilter === "price_asc" ? { color: "black" } : {}}
            >
              낮은 가격순
            </span>
            <span
              onClick={() => onFilterChanged("price_desc")}
              className={styles.sortItem}
              style={currentFilter === "price_desc" ? { color: "black" } : {}}
            >
              높은 가격순
            </span>
          </div>
          <div className={styles.wrapProducts}>
            {products.length == 0 ? (
              <span className={styles.isEmpty}>
                {input} 에 만족하는 상품이 존재하지 않습니다.
              </span>
            ) : (
              products.map((item: ProductInfo) => (
                <Product key={item._id} data={item} />
              ))
            )}
          </div>
          {products.length == 0 ? (
            ""
          ) : (
            <PageNationNum
              totalPages={totalPage}
              currentPage={currentPage}
              onPageChange={onPageChanged}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchProductPage;
