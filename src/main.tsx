import React from "react";
import ReactDOM from "react-dom/client";
import { SpaApp } from "./spa-app";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SpaApp />
  </React.StrictMode>,
);
