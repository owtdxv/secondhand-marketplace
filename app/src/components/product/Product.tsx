import styles from "@/styles/components/product.module.css";
import { ProductInfo } from "../../types/product";

interface PropsType {
  data: ProductInfo;
}

const Product = ({ data }: PropsType) => {
  return (
    <div className={styles.wrap}>
      <div className={styles.photo}>{data.photo}</div>
      <div className={styles.title}>{data.title}</div>
      <div className={styles.price}>{data.price}원</div>
      <div className={styles.time}>{data.time}</div>
    </div>
  );
};

export default Product;
