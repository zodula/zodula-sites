import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const appElement = document.getElementById("app");
if (!appElement) {
  throw new Error("App element not found");
}

const root = createRoot(appElement);
root.render(<App />);   