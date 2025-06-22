import styles from "@/styles/pages/myPage.module.css";
import Content from "./Content";
import editIcon from "@/assets/icon/edit.png";
import camera from "@/assets/icon/cameraWhite.png";
import { ProductInfo } from "../../types/product";
import { UserInfo } from "../../types/user";

interface PropsType {
  page: string;
  editMode: boolean;
  data: ProductInfo[];
  userInfo: UserInfo | undefined;
  nickName?: string;
  filter?: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleEditMode: () => void;
  onChangePage: (page: string) => void;
  onChangeFilter: (filter: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChangeNickName: (e: any) => void;
  handleCameraClick: () => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MyPage = ({
  page,
  editMode,
  data,
  nickName,
  userInfo,
  filter,
  fileInputRef,
  handleEditMode,
  onChangePage,
  onChangeFilter,
  handleKeyDown,
  onChangeNickName,
  handleCameraClick,
  handleImageChange,
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
                <div className={styles.profileWrapper}>
                  <img
                    src={
                      userInfo?.profileImage
                        ? userInfo?.profileImage
                        : "@/assets/icon/person.png"
                    }
                    className={styles.profile}
                  />
                  <div
                    onClick={handleCameraClick}
                    className={styles.wrapCamera}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      onChange={handleImageChange}
                    />
                    <img src={camera} width={15} />
                  </div>
                </div>
                <div className={styles.userInfo}>
                  {editMode ? (
                    <input
                      className={styles.nickName}
                      style={{
                        borderBottom: "1px solid black",
                      }}
                      onKeyDown={handleKeyDown}
                      value={nickName}
                      onChange={(e) => {
                        onChangeNickName(e.target.value);
                      }}
                    />
                  ) : (
                    <h1 className={styles.nickName}>
                      {nickName}
                      <img
                        onClick={handleEditMode}
                        width={23}
                        height={23}
                        src={editIcon}
                      />
                    </h1>
                  )}

                  <p className={styles.email}>{userInfo?.email}</p>
                </div>
              </div>

              <div className={styles.stateBox}>
                <div
                  style={{ marginLeft: "70px" }}
                  className={styles.wrapState}
                >
                  <p>전체</p>
                  <div>{userInfo?.productCounts.total}</div>
                </div>
                <div className={styles.verticalLine}></div>
                <div className={styles.wrapState}>
                  <p>판매중</p>
                  <div>{userInfo?.productCounts.onSale}</div>
                </div>
                <div className={styles.verticalLine}></div>
                <div
                  style={{ marginRight: "70px" }}
                  className={styles.wrapState}
                >
                  <p>판매 완료</p>
                  <div>{userInfo?.productCounts.soldOut}</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bottomContent}>
            {page === "my-product" ? (
              <Content
                data={data}
                title="내 상품"
                filter={filter}
                onChangeFilter={onChangeFilter}
              />
            ) : null}
            {page === "liked-product" ? (
              <Content
                data={data}
                title="좋아요 한 상품"
                filter={filter}
                onChangeFilter={onChangeFilter}
              />
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
