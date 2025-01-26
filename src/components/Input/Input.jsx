import styles from "./Input.module.css";

export default function Input({ placeholder, value, onChange, title, type }) {
  return (
    <input
      className={styles.input}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      title={title}
      required
    />
  );
}
