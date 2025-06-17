import styles from "@/styles/pages/addProduct.module.css";
import Input from "../../components/inputs/Input";
import LocationModal from "../../components/modal/LocationModal";

import cameraIcon from "@/assets/icon/camera.png";
import XButton from "@/assets/icon/X.png";
import { createProduct } from "../../types/product";

interface PropsType {
  modal: boolean;
  region: string;
  data: createProduct;
  mode: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  imagesFiles: File[];
  imagePreview: { file: File; url: string }[];
  setRegion: (region: string) => void;
  modalHandler: () => void;
  onChangeValue: (e: any) => void;
  removeImage: (target: File | string) => void;
  onClickSubmit: () => void;
  handleCameraClick: () => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddProduct = ({
  modal,
  region,
  data,
  mode,
  fileInputRef,
  imagesFiles,
  imagePreview,
  setRegion,
  modalHandler,
  onChangeValue,
  removeImage,
  onClickSubmit,
  handleCameraClick,
  handleImageChange,
}: PropsType) => {
  return (
    <div className={styles.wrap}>
      <div className={styles.addProduct}>
        <div className={styles.photos}>
          <div onClick={handleCameraClick} className={styles.photo}>
            <div>
              <img width={26} height={26} src={cameraIcon} />
              <div className={styles.count}>{data.images?.length}/2</div>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>

          {/* ✅ 이미지 미리보기 출력 */}
          {imagePreview &&
            imagePreview.map((item) => (
              <div
                key={item.url}
                style={{
                  backgroundImage: `url(${item.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className={styles.IsPhoto}
              >
                <div>
                  <div
                    onClick={() => removeImage(item.file)}
                    className={styles.delete}
                  >
                    <img width={13} height={13} src={XButton} />
                  </div>
                </div>
              </div>
            ))}

          {/* 기존 이미지 출력 */}
          {data.images &&
            data.images.map((item) => (
              <div
                key={item}
                style={{
                  backgroundImage: `url(${item})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className={styles.IsPhoto}
              >
                <div>
                  <div
                    onClick={() => removeImage(item)}
                    className={styles.delete}
                  >
                    <img width={13} height={13} src={XButton} />
                  </div>
                </div>
              </div>
            ))}
        </div>

        <Input
          name="name"
          value={data.name}
          onChange={onChangeValue}
          type="text"
          placeholder="상품명을 입력해주세요."
          width="850px"
        />

        <div className={styles.secondLine}>
          <div className={styles.wrapSelect}>
            <select
              name="category"
              value={data.category}
              onChange={onChangeValue}
              required
              className={styles.select}
            >
              <option value="" disabled hidden>
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
              name="saleRegion"
              onClick={modalHandler}
              required
              className={`${styles.select} ${
                region === "지역 선택" ? styles.placeholder : ""
              }`}
            >
              <option value={region} disabled hidden>
                {region}
              </option>
            </select>
            {modal ? <LocationModal setRegion={setRegion} /> : null}
          </div>
        </div>

        <Input
          name="price"
          onChange={onChangeValue}
          type="number"
          placeholder="₩ 상품의 가격을 입력해주세요"
          width="850px"
          value={data.price}
        />

        <textarea
          name="description"
          onChange={onChangeValue}
          className={styles.textarea}
          placeholder="상품에 대한 설명을 입력해주세요."
          value={data.description}
        ></textarea>

        <button onClick={onClickSubmit} className={styles.submitBtn}>
          {mode == "edit" ? "수정하기" : "등록하기"}
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
