import React, { useState } from 'react';
import './Nav.css'; // Replace with your actual CSS file
import { useLanguage } from './../language/Lang'

const Nav = () => {
  const { lang } = useLanguage();
  const [selectedButton, setSelectedButton] = useState('myProfile');

  return (
    <nav>
      <button
        className={selectedButton === 'myProfile' ? 'selected' : ''}
        onClick={() => setSelectedButton('myProfile')}
      >
        <img src="https://api.impactium.fun/ux/casual.svg" alt="Casual" />
        <p>{lang.myProfile}</p>
      </button>
      <button
        className={selectedButton === 'buySomeStuff' ? 'selected' : ''}
        onClick={() => setSelectedButton('buySomeStuff')}
      >
        <img src="https://api.impactium.fun/ux/donate.svg" alt="Donate" />
        <p>{lang.buySomeStuff}</p>
      </button>
    </nav>
  );
};

export default Nav;