import styles from "./Input.module.css";

export default function Input({ placeholder, value, onChange, title, type }) {
  return (
    <input
      className={styles.input}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type={type}
      title={title}
      required
    />
  );
}
