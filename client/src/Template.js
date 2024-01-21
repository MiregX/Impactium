import React, { useState } from 'react';
import './Template.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Preloader from './modules/Preloader';
import Language from './modules/language/Language';
import Header from './modules/header/Header';
import HeaderBackground from './modules/header/HeaderBackground';
import { HeaderProvider } from './modules/header/HeaderContext';
import Main from './modules/main/Main';
import Login from './modules/auth/Login';
import Callback from './modules/auth/Callback';
import LanguageProvider from './modules/language/Lang';
import UserProvider from './class/User';
import Personal from './modules/me/Personal'
import { MessageProvider, useMessageContext } from './modules/message/Message';

function Template() {

  return (
    <UserProvider>
      <LanguageProvider>
        <MessageProvider>
          <Router>
            <Preloader />
            <Language />
            <HeaderProvider>
              <Header />
              <HeaderBackground />
              <main>
                <Routes>
                  <Route path="/" element={<Main />} />
                  <Route path="login" element={<Login />}>
                    <Route
                      path="callback"
                      element={<Callback />}
                    />
                  </Route>
                </Routes>
              </main>
            </HeaderProvider>
          </Router>
        </MessageProvider>
      </LanguageProvider>
    </UserProvider>
  );
}

export default Template;
