import styles from "@/styles/components/pageNation.module.css";

interface PropsType {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PageNation = ({ totalPages, currentPage, onPageChange }: PropsType) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={styles.pagination}>
      {pages.map((page) => (
        <div
          key={page}
          onClick={() => onPageChange(page)}
          className={`${styles.dot} ${
            currentPage === page ? styles.active : ""
          }`}
        ></div>
      ))}
    </div>
  );
};

export default PageNation;
