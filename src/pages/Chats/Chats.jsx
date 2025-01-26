import styles from "./Chats.module.css";
import Input from "../../components/Input/Input";
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
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [phoneNumber]);

  const handleMessage = (e) => {
    setMessage(e.target.value);
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
        setChatMessages((prevMessages) => [
          ...prevMessages,
          {
            className: "send_message",
            message,
            id: data.idMessage,
          },
        ]);
        setMessage("");
      } else {
        console.log("Ошибка при отправке сообщения");
      }
    } catch (err) {
      console.log(err);
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
        const senderName = data.body.senderData.senderName;
        setContactName(senderName);
        const message = data.body.messageData.textMessageData.textMessage;

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
              className: "receive_message",
              id: data.body.idMessage,
            },
          ];
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.chat_page}>
      <div className={styles.left_panel}>
        <h1>Чаты</h1>
      </div>
      <div className={styles.right_panel}>
        {contactName && <div className={styles.contact_name}>{contactName}</div>}
        <div className={styles.chat_history}>
          {chatMessages.map((el) => {
            return (
              <Message
                key={el.id}
                className={el.className}
                message={el.message}
              />
            );
          })}
        </div>
        <form className={styles.message_form} onSubmit={sendMessage}>
          <Input
            placeholder="Введите ваше сообщение"
            value={message}
            onChange={handleMessage}
          />
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
