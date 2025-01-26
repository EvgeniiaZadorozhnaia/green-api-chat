import styles from "./CreateChat.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

export default function CreateChat({ phoneNumber, setPhoneNumber }) {
  const navigate = useNavigate();

  const handleChat = () => {
    navigate("/chats");
  };

  return (
    <>
      <div className={styles.createChat_page}>
        <h1 className={styles.header}>Введите номер телефона получателя</h1>
        <Input
          className
          placeholder="89523205466"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          title="Формат номера телефона: 89523205466"
        />
        <Button text={"Начать чат"} onClick={handleChat} />
      </div>
    </>
  );
}
