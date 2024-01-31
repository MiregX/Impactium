import React, { lazy, Suspense, memo, useEffect } from 'react';
import './Template.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Preloader from './modules/preloader/Preloader';
import Language from './modules/language/Language';
import Header from './modules/header/Header';
import HeaderBackground from './modules/header/HeaderBackground';
import { HeaderProvider } from './modules/header/HeaderContext';
import Main from './modules/main/Main';
import { useUser } from './class/User';

// Ленивая загрузка Personal компонента
const Personal = lazy(() => import('./modules/me/Personal').then(module => ({ default: memo(module.default) })));
const Login = lazy(() => import('./modules/auth/Login').then(module => ({ default: memo(module.default) })));
const Callback = lazy(() => import('./modules/auth/Callback').then(module => ({ default: memo(module.default) })));

function Template() {
  const { token } = useUser();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const referal = queryParams.get('ref');
    if (!referal) return
    localStorage.setItem('ref', referal);
    queryParams.delete('ref');
  }, []);

  return (
    <Router>
      <Preloader />
      <Language />
      <HeaderProvider>
        <Header />
        <HeaderBackground />
        <main>
          <Suspense fallback={<Main />}>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="login" element={<Login />}>
                <Route path="callback" element={<Callback />} />
              </Route>
              { token ? (
                <Route path="me" element={<Personal />} />
              ) : (
                <Route path="me" element={<Navigate to="/login" />} />
              )}
            </Routes>
          </Suspense>
        </main>
      </HeaderProvider>
    </Router>
  );
}

export default Template;
