import styles from "@/styles/components/footer.module.css";

import insta from "@/assets/icon/insta.png";
import twitter from "@/assets/icon/twitter.png";
import facebook from "@/assets/icon/facebook.png";
import youtube from "@/assets/icon/youtube.png";
import call from "@/assets/icon/phone.png";

const Footer = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.footerTop}>
        <ul className={styles.menu}>
          <li>회사 소개</li>
          <div className={styles.miniLine}></div>
          <li>이용 약관</li>
          <div className={styles.miniLine}></div>
          <li>개인정보처리방침</li>
          <div className={styles.miniLine}></div>
          <li>제휴 문의</li>
          <div className={styles.miniLine}></div>
          <li>구매 문의</li>
        </ul>
      </div>
      <hr className={styles.line} />
      <div className={styles.footerBottom}>
        <div className={styles.wrapBottom}>
          <div className={styles.left}>
            <div style={{ fontSize: "16px", marginBottom: "10px" }}>
              (주)어디있누
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "5px",
                alignItems: "center",
              }}
            >
              <div>대표이사 : 어디있누</div>
              <div className={styles.miniLine}></div>
              <div>서울특별시 구로루 고척동</div>
              <div className={styles.miniLine}></div>
              <div>사업자 : 어디있누 시스템</div>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div>통신판매업신고 : 2025-서울-8888</div>
              <div className={styles.miniLine}></div>
              <div>E_mail : whereIsIt@gmail.com</div>
            </div>
            <div style={{ display: "flex", gap: "38px", marginTop: "30px" }}>
              <img width={24} height={24} src={insta} />
              <img width={24} height={24} src={facebook} />
              <img width={24} height={24} src={twitter} />
              <img width={24} height={24} src={youtube} />
            </div>
          </div>

          <div className={styles.right}>
            <div
              style={{
                display: "flex",
                marginBottom: "15px",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: "18px" }}>고객센터 1588-1588</div>
              <div
                style={{
                  border: "1px solid white",
                  width: "70px",
                  height: "24px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "12px",
                  marginLeft: "15px",
                }}
              >
                1:1문의하기
              </div>
            </div>
            <div>
              <div style={{ marginBottom: "7px" }}>
                운영시간 : 평일 09:00 ~ 18:00
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                고객센터 바로가기 <img width={14} height={14} src={call} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
