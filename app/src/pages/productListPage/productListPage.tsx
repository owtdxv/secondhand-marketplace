import styles from "@/styles/pages/productListPage.module.css";
import Footer from "../../components/Footer";
import { ProductInfo } from "../../types/product";
import Product from "../../components/product/Product";

interface PropsType {
  products: ProductInfo[];
}
const ProductListPage = ({ products }: PropsType) => {
  return (
    <div>
      <div className={styles.wrap}>
        <div className={styles.content}>
          <div className={styles.title}>최근 올라온 상품</div>
          <div className={styles.filter}>
            <span className={styles.sortItem}>최신순</span>
            <span className={styles.sortItem}>낮은 가격순</span>
            <span className={styles.sortItem}>높은 가격순</span>
          </div>
          <div className={styles.wrapProducts}>
            {products.map((item: ProductInfo) => (
              <Product key={item._id} data={item} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductListPage;
