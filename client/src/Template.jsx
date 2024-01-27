import React, { lazy, Suspense, memo, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Preloader from './modules/preloader/Preloader';
import Language from './modules/language/Language';
import Header from './modules/header/Header';
import HeaderBackground from './modules/header/HeaderBackground';
import { HeaderProvider } from './modules/header/HeaderContext';
import Main from './modules/main/Main';
import LanguageProvider from './modules/language/Lang';
import UserProvider, { useUser } from './class/User';
import { MessageProvider } from './modules/message/Message';
import PlayerProvider from './class/Player';

// Ленивая загрузка Personal компонента
const Personal = lazy(() => import('./modules/me/Personal').then(module => ({ default: memo(module.default) })));
const Login = lazy(() => import('./modules/auth/Login').then(module => ({ default: memo(module.default) })));
const Callback = lazy(() => import('./modules/auth/Callback').then(module => ({ default: memo(module.default) })));

function Template() {
  const { user } = useUser();

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
                  <Suspense fallback={null}>
                    <Routes>
                      <Route path="/" element={<Main />} />
                      <Route path="login" element={<Login />}>
                        <Route path="callback" element={<Callback />} />
                      </Route>
                      {user ? (
                        <Route path="me" element={<Personal />} />
                      ) : (
                        // Перенаправление на главную, если нет пользователя
                        <Route element={<Navigate to="/" />} />
                      )}
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
