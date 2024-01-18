import React, { useState, useEffect } from 'react';
import './Template.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Preloader from './modules/Preloader';
import Language from './modules/Language';
import Header from './modules/Header';
import HeaderBackground from './modules/HeaderBackground';
import Main from './modules/main/Main';
import { useUser } from './class/User';

function Template() {
  const [loading, setLoading] = useState(true);
  const { user, getUser } = useUser()

  useEffect( async () => {
    await getUser();
  }, []); // Пустой массив зависимостей гарантирует, что useEffect выполняется только один раз при монтировании компонента

  return (
    <div>
      <Router>
        {loading && <Preloader />}
        <Language />
        <Header />
        <HeaderBackground />
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      </Router>
    </div>
  );
}

export default Template;
