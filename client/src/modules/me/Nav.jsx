import React, { useState } from 'react';
import './Nav.css'; // Replace with your actual CSS file
import { useNavigate } from 'react-router-dom'; // Добавлен импорт для использования функции навигации
import { useLanguage } from '../language/Lang';
import { useUser } from '../../class/User';

const Nav = () => {
  const { lang } = useLanguage();
  const { user } = useUser();
  const [selectedButton, setSelectedButton] = useState('myProfile');
  const navigate = useNavigate(); // Инициализация функции навигации

  const handleNavigation = (button) => {
    setSelectedButton(button);
    switch (button) {
      case 'myProfile':
        navigate('/me/account');
        break;
      case 'buySomeStuff':
        break;
      case 'terminal':
        if (user.isCreator) {
          navigate('/me/terminal');
        }
        break;
      default:
        break;
    }
  };

  return (
    <nav>
      <button
        className={selectedButton === 'myProfile' ? 'selected' : ''}
        onClick={() => handleNavigation('myProfile')}
      >
        <img src="https://cdn.impactium.fun/ux/casual.svg" alt="Casual" />
        <p>{lang.myProfile}</p>
      </button>
    </nav>
  );
};

export default Nav;
