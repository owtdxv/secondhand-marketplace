import styles from "@/styles/components/input.module.css";

interface PropsType {
  type: string;
  placeholder: string;
  width: string;
  name: string;
  onChange: (e: any) => void;
}

const Input = ({ type, placeholder, width, name, onChange }: PropsType) => {
  return (
    <input
      name={name}
      style={{ width: width }}
      className={styles.input}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default Input;
