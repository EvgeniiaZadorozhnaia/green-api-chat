import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import React, { createContext, useState } from "react";

const myContext = createContext();

export const ContextProvider = ({children})


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
