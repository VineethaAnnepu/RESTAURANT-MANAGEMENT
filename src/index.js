import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom'; // <-- 1. CHANGE THIS LINE

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter> {/* <-- 2. CHANGE THIS LINE */}
      <App />
    </HashRouter> {/* <-- 3. CHANGE THIS LINE */}
  </React.StrictMode>
);
