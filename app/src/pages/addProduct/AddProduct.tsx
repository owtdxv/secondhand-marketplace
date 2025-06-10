import styles from "@/styles/pages/addProduct.module.css";
import Input from "../../components/inputs/Input";
import LocationModal from "../../components/modal/LocationModal";

interface PropsType {
  modal: boolean;
  region: string;
  setRegion: (region: string) => void;
  modalHandler: () => void;
  onChangeValue: (e: any) => void;
  createProduct: () => void;
}

const AddProduct = ({
  modal,
  region,
  setRegion,
  modalHandler,
  onChangeValue,
  createProduct,
}: PropsType) => {
  return (
    <div className={styles.wrap}>
      <div className={styles.addProduct}>
        <div className={styles.photos}>
          <div className={styles.photo}></div>
        </div>
        <Input
          name="name"
          onChange={onChangeValue}
          type="text"
          placeholder="상품명을 입력해주세요."
          width="850px"
        />
        <div className={styles.secondLine}>
          <div className={styles.wrapSelect}>
            <select
              name="category"
              onChange={onChangeValue}
              required
              className={styles.select}
            >
              <option value="" disabled hidden selected>
                카테고리
              </option>
              <option>디지털/가전</option>
              <option>가구/인테리어</option>
              <option>의류/패션</option>
              <option>생활/주방용품</option>
              <option>유아동/출산용품</option>
              <option>도서/문구</option>
              <option>스포츠/레저</option>
              <option>게임/취미용품</option>
              <option>반려동물용품</option>
              <option>기타</option>
            </select>
          </div>
          <div className={styles.locationSelectWrap}>
            <select
              name="region"
              onClick={modalHandler}
              required
              className={`${styles.select} ${
                region === "지역 선택" ? styles.placeholder : ""
              }`}
            >
              <option value={region} disabled hidden selected>
                {region}
              </option>
            </select>
            {modal ? <LocationModal setRegion={setRegion} /> : null}
          </div>
        </div>

        <Input
          name="price"
          onChange={onChangeValue}
          type="text"
          placeholder="₩ 상품의 가격을 입력해주세요"
          width="850px"
        />
        <textarea
          name="description"
          onChange={onChangeValue}
          className={styles.textarea}
          placeholder="상품에 대한 설명을 입력해주세요."
        ></textarea>
        <button onClick={createProduct} className={styles.submitBtn}>
          등록하기
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
