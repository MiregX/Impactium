import React from 'react';
import './Template.css';
import Preloader from './modules/Preloader';
import Language from './modules/Language';
import Header from './modules/Header';
import HeaderBackground from './modules/HeaderBackground';

function Template() {
  return (
    <div>
      <Preloader />
      <Language />
      <Header />
      <HeaderBackground />
    </div>
  );
}

export default Template;
