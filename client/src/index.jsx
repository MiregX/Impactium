import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import UserProvider from './class/User';
import LanguageProvider from './modules/language/Lang';
import { MessageProvider } from './modules/message/Message';
import PlayerProvider from './class/Player';
import Template from './Template';

const rootElement = document.getElementById('root');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <UserProvider>
    <LanguageProvider>
      <MessageProvider>
        <PlayerProvider>
          <Template />
        </PlayerProvider>
      </MessageProvider>
    </LanguageProvider>
  </UserProvider>
);
