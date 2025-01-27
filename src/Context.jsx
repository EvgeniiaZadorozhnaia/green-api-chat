import { createContext, useState } from "react";

const Context = createContext();

export const ContextProvider = ({ children }) => {
  
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <Context.Provider
      value={{
        idInstance,
        setIdInstance,
        apiTokenInstance,
        setApiTokenInstance,
        phoneNumber,
        setPhoneNumber,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
