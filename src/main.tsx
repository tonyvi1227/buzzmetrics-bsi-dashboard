import React from 'react';
import ReactDOM from 'react-dom/client';
import { Chart as ChartJS, registerables } from 'chart.js';
import App from './App';
import './index.css';

// Register ChartJS components & enforce Inter font globally for all Canvas elements
ChartJS.register(...registerables);
ChartJS.defaults.font.family = "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
