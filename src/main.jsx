import './styles/BirthdayWishes.css';
import './styles/glow.css';
import './styles/theme.css';
import './styles/components.css';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";


if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered:", registration);
    })
    .catch((err) => console.log("SW registration failed:", err));
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);