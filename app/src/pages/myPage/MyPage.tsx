import styles from "@/styles/pages/myPage.module.css";
import Content from "./Content";
import editIcon from "@/assets/icon/edit.png";
import { ProductInfo } from "../../types/product";
interface PropsType {
  page: string;
  editMode: boolean;
  data: ProductInfo[];
  handleEditMode: () => void;
  onChangePage: (page: string) => void;
}

const MyPage = ({
  page,
  editMode,
  data,
  handleEditMode,
  onChangePage,
}: PropsType) => {
  return (
    <div className={styles.wrap}>
      <div className={styles.myPage}>
        <div className={styles.side}>
          <h1 className={styles.myPageTitle}>마이페이지</h1>
          <ul className={styles.sideList}>
            <li onClick={() => onChangePage("my-product")}>내 상품</li>
            <li onClick={() => onChangePage("liked-product")}>
              좋아요 한 상품
            </li>
            <li onClick={() => onChangePage("recent-view")}>최근 본 상품</li>
          </ul>
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <h1 className={styles.myPageTitle}>내 정보</h1>
            <hr className={styles.line} />
            <div className={styles.wrapUserInfo}>
              <div className={styles.userInfoLeft}>
                <div className={styles.profile}></div>
                <div className={styles.userInfo}>
                  {editMode ? (
                    <input
                      className={styles.nickName}
                      style={{
                        borderBottom: "1px solid black",
                      }}
                      value="내가 이 구역 판매왕"
                    />
                  ) : (
                    <h1 className={styles.nickName}>
                      내가 이 구역 판매왕
                      <img
                        onClick={handleEditMode}
                        width={23}
                        height={23}
                        src={editIcon}
                      />
                    </h1>
                  )}

                  <p className={styles.email}>chhari0708@naver.com</p>
                </div>
              </div>

              <div className={styles.stateBox}>
                <div
                  style={{ marginLeft: "70px" }}
                  className={styles.wrapState}
                >
                  <p>전체</p>
                  <div>15</div>
                </div>
                <div className={styles.verticalLine}></div>
                <div className={styles.wrapState}>
                  <p>판매중</p>
                  <div>3</div>
                </div>
                <div className={styles.verticalLine}></div>
                <div
                  style={{ marginRight: "70px" }}
                  className={styles.wrapState}
                >
                  <p>판매 완료</p>
                  <div>12</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bottomContent}>
            {page === "my-product" ? (
              <Content data={data} title="내 상품" />
            ) : null}
            {page === "liked-product" ? (
              <Content data={data} title="좋아요 한 상품" />
            ) : null}
            {page === "recent-view" ? (
              <Content data={data} title="최근 본 상품" />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
