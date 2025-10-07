import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Assumes your file is in this folder
import './index.css';

// The '!' tells TypeScript that this element will definitely exist.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
