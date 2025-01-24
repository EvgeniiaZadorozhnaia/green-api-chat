import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  // Состояния для хранения данных и сообщений
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Состояния для отображения ошибок
  const [error, setError] = useState(null);

  // Функция для отправки сообщения
  const sendMessage = async () => {
    if (!message || !phoneNumber) {
      setError("Введите сообщение и номер телефона");
      console.log(error);

      return;
    }

    try {
      const response = await axios.post(
        `https://7103.api.greenapi.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
        {
          chatId: `${phoneNumber}@c.us`,
          message: message,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.idMessage) {
        // Добавляем новое сообщение в чат
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { sender: "You", text: message },
        ]);
        setMessage(""); // Очищаем поле ввода
      } else {
        setError("Ошибка при отправке сообщения");
        console.log(error);
      }
    } catch (err) {
      setError("Ошибка сети");
      console.log(err);
    }
  };

  // Функция для получения сообщений
  const receiveMessages = async () => {
    try {
      const response = await axios.get(
        `https://7103.api.greenapi.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`
      );

      const receiptId = response?.data.receiptId;
      if (receiptId) {
        await axios.delete(
          `https://7103.api.greenapi.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`
        );
      }

      if (response?.data.body?.idMessage) {
        const sender = response.data.body.senderData.senderName;
        const message =
          response.data.body.messageData.textMessageData.textMessage;

        setChatMessages((prevMessages) => {
          // Проверка, чтобы не добавлять одно и то же сообщение несколько раз
          const isMessageExists = prevMessages.some(
            (msg) => msg.sender === sender && msg.text === message
          );
          if (isMessageExists) {
            return prevMessages;
          }

          return [
            ...prevMessages,
            {
              sender: sender,
              text: message,
            },
          ];
        });
      }
    } catch (err) {
      setError("Ошибка при получении сообщений");
      console.log(err);
    }
  };

  // Хук для автоматической проверки новых сообщений
  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(() => {
        receiveMessages();
      }, 10000); // Получать сообщения каждые 3 секунды
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // Функция для входа
  const handleLogin = () => {
    if (!idInstance || !apiTokenInstance) {
      setError("Введите учетные данные");
      console.log(error);
      
      return;
    }
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      <div className="login-form">
        {!isLoggedIn ? (
          <>
            <h2>Вход в WhatsApp через GREEN-API</h2>
            <input
              type="text"
              placeholder="Введите idInstance"
              value={idInstance}
              onChange={(e) => setIdInstance(e.target.value)}
            />
            <input
              type="text"
              placeholder="Введите apiTokenInstance"
              value={apiTokenInstance}
              onChange={(e) => setApiTokenInstance(e.target.value)}
            />
            <button onClick={handleLogin}>Войти</button>
          </>
        ) : (
          <>
            <h2>Чат с WhatsApp</h2>
            <input
              type="text"
              placeholder="Введите номер телефона"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <div className="chat">
              <div className="messages">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={
                      msg.sender === "You" ? "message sent" : "message received"
                    }>
                    <strong>{msg.sender}:</strong> {msg.text}
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder="Введите сообщение"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Отправить</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
