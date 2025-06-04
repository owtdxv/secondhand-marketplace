import styles from "@/styles/components/product.module.css";
import { ProductInfo } from "../../types/product";

interface PropsType {
  data: ProductInfo;
}
const Product = ({ data }: PropsType) => {
  return (
    <div className={styles.wrap}>
      <div className={styles.photo}>
        <img src={data.images[0]} className={styles.image} />
      </div>
      <div className={styles.title}>{data.name}</div>
      <div className={styles.price}>{data.price.toLocaleString()}원</div>
      <div className={styles.time}>{data.lastUpdated}</div>
    </div>
  );
};

export default Product;
