import styles from "./Message.module.css";

export default function Message({ className, message }) {
  return <div className={`${styles[className]}`}>{message}</div>;
}
