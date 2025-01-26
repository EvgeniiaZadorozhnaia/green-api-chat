import styles from "./Input.module.css";

export default function Input({ placeholder, value, onChange, title }) {
  return (
    <input
      className={styles.input}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      title={title}
      required
    />
  );
}
