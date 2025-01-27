import styles from "./Chats.module.css";
import { useContext, useState } from "react";
import axios from "axios";
import Message from "../../components/Message/Message";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Context from "../../Context";

export default function Chats() {

  const { idInstance, apiTokenInstance, phoneNumber, setPhoneNumber } =
    useContext(Context);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [contactName, setContactName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    receiveMessages();
  }, []);

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleNewChat = () => {
    setPhoneNumber("");
    navigate("/create-chat");
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
            id: data.idMessage,
            time: formattedTime,
            message,
            className: "send_message",
          },
        ]);
        setMessage("");
      } else {
        console.log("Ошибка при отправке сообщения");
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  const receiveMessages = async () => {
    try {
      const { data } = await axios.get(
        `https://7103.api.greenapi.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`
      );

      const { receiptId } = data;

      if (receiptId) {
        await axios.delete(
          `https://7103.api.greenapi.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`
        );
      }

      const receiveMessage =
        data?.body?.messageData?.textMessageData?.textMessage;

      if (receiveMessage) {
        const messageID = data?.body?.idMessage;
        const senderName = data?.body?.senderData?.senderName;
        const currentTime = new Date();
        const formattedTime = formatTime(currentTime);

        if (senderName !== contactName) {
          setContactName(senderName);
        }

        setChatMessages((prevMessages) => {
          const isMessageExists = prevMessages.some(
            (msg) => msg.id === messageID
          );
          if (isMessageExists) {
            return prevMessages;
          }

          return [
            ...prevMessages,
            {
              id: messageID,
              time: formattedTime,
              message: receiveMessage,
              className: "receive_message",
            },
          ];
        });
      }
      await receiveMessages();
    } catch (e) {
      setTimeout(() => {
        receiveMessages();
      }, 5000);
    }
  };

  return (
    <div className={styles.chat_page}>
      <div className={styles.chat_header}>
        <div className={styles.contact_name}>
          <img
            className={styles.avatar}
            src="/icons/avatar.gif"
            alt="Аатар пользователя"
          />
          {contactName ? contactName : phoneNumber}
        </div>
        <button className={styles.headerB} onClick={handleNewChat}>
          + новый чат
        </button>
      </div>

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
  );
}
