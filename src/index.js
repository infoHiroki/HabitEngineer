import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ブラウザのスクロールを滑らかにする
document.documentElement.style.scrollBehavior = 'smooth';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// パフォーマンスを測定したい場合はこちらを使用
// https://bit.ly/CRA-vitals
reportWebVitals();
