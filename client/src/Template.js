import React from 'react';
import './Template.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Preloader from './modules/Preloader';
import Language from './modules/Language';
import Header from './modules/Header';
import HeaderBackground from './modules/HeaderBackground';
import Main from './modules/main/Main';
import Login from './modules/auth/Login';

function Template() {
  return (
    <Router>
      <Preloader />
      <Language />
      <Header />
      <HeaderBackground />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default Template;
