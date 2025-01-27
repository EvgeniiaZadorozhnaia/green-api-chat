import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home/Home";
import CreateChat from "./pages/CreateChat/CreateChat";
import Chats from "./pages/Chats/Chats";

function App() {
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              idInstance={idInstance}
              setIdInstance={setIdInstance}
              apiTokenInstance={apiTokenInstance}
              setApiTokenInstance={setApiTokenInstance}
            />
          }
        />
        <Route
          path="/create-chat"
          element={
            <CreateChat
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
            />
          }
        />
        <Route
          path="/chats"
          element={
            <Chats
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              idInstance={idInstance}
              apiTokenInstance={apiTokenInstance}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
