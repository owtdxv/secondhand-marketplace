import styles from "@/styles/components/product.module.css";
import { ProductInfo } from "../../types/product";
import { Link } from "react-router-dom";

interface PropsType {
  data: ProductInfo;
}
const Product = ({ data }: PropsType) => {
  return (
    <Link to={`/products/${data._id}`} className={styles.link}>
      <div className={styles.wrap}>
        <div className={styles.photo}>
          <img src={data.images[0]} className={styles.image} />
        </div>
        <div className={styles.title}>{data.name}</div>
        <div className={styles.price}>{data.price.toLocaleString()}원</div>
        <div className={styles.time}>{data.lastUpdated}</div>
      </div>
    </Link>
  );
};

export default Product;
