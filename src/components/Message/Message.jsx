import styles from "./Message.module.css";

export default function Message({ className, message, time }) {
  return (
    <div className={`${styles[className]}`}>
      <div>{message}</div>
      <div className={styles.time}>{time}</div>
    </div>
  );
}
