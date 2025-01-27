import { useState } from "react";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";

import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Home({
  idInstance,
  setIdInstance,
  apiTokenInstance,
  setApiTokenInstance,
}) {
  const navigate = useNavigate();

  const [showApiTokenInstance, setShowApiTokenInstance] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/create-chat");
  };

  const handleIdInstance = (e) => {
    setIdInstance(e.target.value);
  };

  const handleApiTokenInstance = (e) => {
    setApiTokenInstance(e.target.value);
  };

  const toggleShowApiTokenInstance = () => {
    setShowApiTokenInstance((prevState) => !prevState);
  };

  return (
    <div className={styles.home_page}>
      <h1 className={styles.header}>Добро пожаловать в GREEN CHAT!</h1>
      <form className={styles.login_form} onSubmit={handleLogin}>
        <Input
          placeholder="Введите ваш idInstance"
          value={idInstance}
          onChange={handleIdInstance}
          title="idInstance должен состоять из 10 цифр"
          type="text"
          required
        />
        <div className={styles.inputWrapper}>
          <Input
            placeholder="Введите ваш apiTokenInstance"
            value={apiTokenInstance}
            onChange={handleApiTokenInstance}
            required
            type={showApiTokenInstance ? "text" : "password"}
          />
          <button
            type="button"
            onClick={toggleShowApiTokenInstance}
            className={styles.eyeIcon}
          >
            {showApiTokenInstance ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <Button type="submit" text="Войти" />
      </form>
      <div className={styles.footer}>
        Нет таких данных?
        <a
          href="https://console.green-api.com/instanceList"
          className={styles.link}
          target="blank"
        >
          Получить
        </a>
      </div>
    </div>
  );
}
