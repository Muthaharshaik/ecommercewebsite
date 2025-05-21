import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css';
import { UserProvider } from './context/userContext'; 


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserProvider>
        <App />
    </UserProvider>
  </BrowserRouter>
);

