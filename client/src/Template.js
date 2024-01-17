import React from 'react';
import './Template.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Preloader from './modules/Preloader';
import Language from './modules/Language';
import Header from './modules/Header';
import HeaderBackground from './modules/HeaderBackground';
import Main from './modules/main/Main';

function Template() {
  return (
    <div>
      <Router>
        <Preloader />
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
