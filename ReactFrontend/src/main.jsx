<<<<<<< HEAD
// filepath: d:\Program Files\My Programs\Final Project\HomeHive\ReactFrontend\src\main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
=======
import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
>>>>>>> 8af3bda7d00ef7467cf996f515e425a5ab7c5440

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);