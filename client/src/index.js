import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Template from './Template';
import LanguageProvider from './modules/Lang';
import User from './class/User';

const rootElement = document.getElementById('root');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <User>
      <LanguageProvider>
        <Template />
      </LanguageProvider>
    </User>
  </React.StrictMode>
);
