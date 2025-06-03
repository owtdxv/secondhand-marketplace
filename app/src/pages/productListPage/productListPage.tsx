import styles from "@/styles/pages/productListPage.module.css";
import Footer from "../../components/Footer";
import { ProductInfo } from "../../types/product";
import Product from "../../components/product/Product";
import PageNationNum from "../../components/pageNation/PageNationNum";

interface PropsType {
  products: ProductInfo[];
  currentPage: number;
  totalPage: number;
  onPageChanged: (page: number) => void;
  onFilterChanged: (filter: string) => void;
  currentFilter: string;
}
const ProductListPage = ({
  products,
  currentPage,
  totalPage,
  onPageChanged,
  onFilterChanged,
  currentFilter,
}: PropsType) => {
  return (
    <div>
      <div className={styles.wrap}>
        <div className={styles.content}>
          <div className={styles.title}>최근 올라온 상품</div>
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
            {products.map((item: ProductInfo) => (
              <Product key={item._id} data={item} />
            ))}
          </div>
          <PageNationNum
            totalPages={totalPage}
            currentPage={currentPage}
            onPageChange={onPageChanged}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductListPage;
