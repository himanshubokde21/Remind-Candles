import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import FirebaseService from './services/FirebaseService';

// Initialize Firebase first
const firebase = FirebaseService.getInstance();
console.log("Firebase initialized:", firebase);

// Register the service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered:", registration);
    })
    .catch((err) => console.log("Service Worker registration failed:", err));
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
