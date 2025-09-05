import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import FirebaseService from './services/FirebaseService';

// Initialize Firebase first
FirebaseService.getInstance();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
