import arrowRightGray from "@/assets/icon/arrowRightGray.png";
import styles from "../../styles/components/pageNationNum.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PageNationNum = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className={styles.pagination}>
      <img
        width={21}
        height={21}
        src={arrowRightGray}
        style={{
          transform: "rotate(180deg)",
          marginRight: "10px",
          cursor: currentPage === 1 ? "not-allowed" : "default",
        }}
        onClick={() => onPageChange(currentPage - 1)}
      />
      <div className={styles.number}>
        {pages.map((num) => (
          <span
            style={currentPage === num ? { color: "#61A872" } : {}}
            key={num}
            onClick={() => onPageChange(num)}
          >
            {num}
          </span>
        ))}
      </div>
      <img
        width={21}
        height={21}
        src={arrowRightGray}
        onClick={() => onPageChange(currentPage + 1)}
        style={{
          marginLeft: "10px",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
        }}
      />
    </div>
  );
};

export default PageNationNum;
