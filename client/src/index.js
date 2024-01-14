import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Template from './Template';
import LanguageProvider from './modules/Lang';

const rootElement = document.getElementById('root');

// Используйте createRoot вместо ReactDOM.render
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <LanguageProvider>
      <Template />
    </LanguageProvider>
  </React.StrictMode>
);
