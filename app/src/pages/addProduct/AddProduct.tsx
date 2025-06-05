import styles from "@/styles/pages/addProduct.module.css";
import Input from "../../components/inputs/Input";
import LocationModal from "../../components/modal/LocationModal";

interface PropsType {
  modal: boolean;
  modalHandler: () => void;
}

const AddProduct = ({ modal, modalHandler }: PropsType) => {
  return (
    <div className={styles.wrap}>
      <div className={styles.addProduct}>
        <div className={styles.photos}>
          <div className={styles.photo}></div>
        </div>
        <Input type="text" placeholder="상품명을 입력해주세요." width="850px" />
        <div className={styles.secondLine}>
          <div className={styles.wrapSelect}>
            <select required className={styles.select}>
              <option value="" disabled hidden selected>
                카테고리
              </option>
              <option>전자제품</option>
            </select>
          </div>
          <div className={styles.locationSelectWrap}>
            <select onClick={modalHandler} required className={styles.select}>
              <option value="" disabled hidden selected>
                지역 선택
              </option>
            </select>
            {modal ? <LocationModal /> : null}
          </div>
        </div>

        <Input
          type="money"
          placeholder="₩ 상품의 가격을 입력해주세요"
          width="850px"
        />
        <textarea
          className={styles.textarea}
          placeholder="상품에 대한 설명을 입력해주세요."
        ></textarea>
        <button className={styles.submitBtn}>등록하기</button>
      </div>
    </div>
  );
};

export default AddProduct;
