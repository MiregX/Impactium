import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Template from './Template';
import LanguageProvider from './modules/Lang';
import UserProvider from './class/User';

const rootElement = document.getElementById('root');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <UserProvider>
      <LanguageProvider>
        <Template />
      </LanguageProvider>
    </UserProvider>
  </React.StrictMode>
);
