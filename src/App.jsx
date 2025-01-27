import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import CreateChat from "./pages/CreateChat/CreateChat";
import Chats from "./pages/Chats/Chats";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-chat" element={<CreateChat />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
