import styles from "@/styles/components/input.module.css";

interface PropsType {
  type: string;
  placeholder: string;
  width: string;
  name: string;
  value?: any;
  onChange: (e: any) => void;
}

const Input = ({
  type,
  placeholder,
  width,
  name,
  value,
  onChange,
}: PropsType) => {
  return (
    <input
      name={name}
      style={{ width: width }}
      className={styles.input}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
    />
  );
};

export default Input;
