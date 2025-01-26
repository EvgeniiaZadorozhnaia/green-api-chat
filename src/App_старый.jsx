import { useState, useEffect } from "react";

import Home from "./pages/Home/Home";

//const App = () => {
  
  
 
  
  

  const receiveMessages = async () => {
    try {
      const response = await axios.get(
        `https://7103.api.greenapi.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`
      );

      console.log(response);

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

  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(() => {
        receiveMessages();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  return (
    <div className="App">
      {!isLoggedIn ? (
        <>
          <Home setIsLoggedIn={setIsLoggedIn} />
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
                  }
                >
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
  );
};

//export default App;
