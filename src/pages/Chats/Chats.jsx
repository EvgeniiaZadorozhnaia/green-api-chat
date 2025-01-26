import styles from "./Chats.module.css";
import { useState } from "react";
import axios from "axios";
import Message from "../../components/Message/Message";
import { useEffect } from "react";

export default function Chats({ phoneNumber, idInstance, apiTokenInstance }) {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [contactName, setContactName] = useState("");
  const [chatList, setChatList] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);

  useEffect(() => {
    if (phoneNumber) {
      const interval = setInterval(() => {
        receiveMessages();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [phoneNumber]);

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
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
      if (data.idMessage) {
        const currentTime = new Date();
        const formattedTime = formatTime(currentTime);
        setChatMessages((prevMessages) => [
          ...prevMessages,
          {
            className: "send_message",
            message,
            time: formattedTime,
            id: data.idMessage,
          },
        ]);
        setMessage("");
      } else {
        console.log("Ошибка при отправке сообщения");
      }
    } catch (err) {
      throw new Error(err)
    }
  };

  const receiveMessages = async () => {
    try {
      const { data } = await axios.get(
        `https://7103.api.greenapi.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`
      );
      const receiptId = data.receiptId;
      if (receiptId) {
        await axios.delete(
          `https://7103.api.greenapi.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`
        );
      }

      if (data?.body?.idMessage) {
        const currentTime = new Date();
        const formattedTime = formatTime(currentTime);
        const senderName = data.body.senderData.senderName;
        const message = data.body.messageData.textMessageData.textMessage;

        if (senderName !== contactName) {
          setContactName(senderName);
        }

        setChatMessages((prevMessages) => {
          const isMessageExists = prevMessages.some(
            (msg) => msg.sender === senderName && msg.text === message
          );
          if (isMessageExists) {
            return prevMessages;
          }

          return [
            ...prevMessages,
            {
              message,
              time: formattedTime,
              className: "receive_message",
              id: data.body.idMessage,
            },
          ];
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  return (
    <div className={styles.chat_page}>
      <div className={styles.left_panel}>
        <h1>Чаты</h1>
      </div>
      <div className={styles.right_panel}>
        {contactName && (
          <div className={styles.contact_name}><img className={styles.avatar} src="/icons/avatar.gif" alt="Аатар пользователя" />{contactName}</div>
        )}
        <div className={styles.chat_history}>
          {chatMessages.map((el) => {
            return (
              <Message
                key={el.id}
                className={el.className}
                message={el.message}
                time={el.time}
              />
            );
          })}
        </div>
        <form className={styles.message_form} onSubmit={sendMessage}>
          <textarea
            placeholder="Введите ваше сообщение..."
            onChange={handleMessage}
            value={message}
            rows={1}
          ></textarea>
          <button className={styles.send_button} type="submit">
            <img
              className={styles.send_icon}
              src="/icons/send.png"
              alt="Кнопка отправки сообщения"
            />
          </button>
        </form>
      </div>
    </div>
  );
}
