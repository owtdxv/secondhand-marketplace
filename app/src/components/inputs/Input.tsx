import styles from "@/styles/components/input.module.css";

interface PropsType {
  type: string;
  placeholder: string;
  width: string;
}

const Input = ({ type, placeholder, width }: PropsType) => {
  return (
    <input
      style={{ width: width }}
      className={styles.input}
      type={type}
      placeholder={placeholder}
    />
  );
};

export default Input;
