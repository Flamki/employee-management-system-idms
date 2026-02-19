import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { runInterFontDiagnostics } from "./fontDiagnostics";
import "./styles.css";

runInterFontDiagnostics();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
