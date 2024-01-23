import React, { useState, lazy, Suspense, memo } from 'react';
import './Template.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Preloader from './modules/Preloader';
import Language from './modules/language/Language';
import Header from './modules/header/Header';
import HeaderBackground from './modules/header/HeaderBackground';
import { HeaderProvider } from './modules/header/HeaderContext';
import Main from './modules/main/Main';
import LanguageProvider from './modules/language/Lang';
import UserProvider from './class/User';
import { MessageProvider } from './modules/message/Message';
import PlayerProvider from './class/Player';

// Ленивая загрузка Personal компонента
const Personal = lazy(() => import('./modules/me/Personal').then(module => ({ default: memo(module.default) })));
const Login = lazy(() => import('./modules/auth/Login').then(module => ({ default: memo(module.default) })));
const Callback = lazy(() => import('./modules/auth/Callback').then(module => ({ default: memo(module.default) })));

function Template() {
  return (
    <UserProvider>
      <LanguageProvider>
        <MessageProvider>
          <PlayerProvider>
          <Router>
            <Preloader />
            <Language />
            <HeaderProvider>
              <Header />
              <HeaderBackground />
              <main>
                <Suspense fallback={<div>...</div>}>
                  <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="login" element={<Login />}>
                      <Route path="callback" element={<Callback />} />
                    </Route>
                    <Route
                      path="me"
                      element={
                          <Personal />
                      }
                    />
                  </Routes>
                </Suspense>
              </main>
            </HeaderProvider>
          </Router>
          </PlayerProvider>
        </MessageProvider>
      </LanguageProvider>
    </UserProvider>
  );
}


export default Template;
