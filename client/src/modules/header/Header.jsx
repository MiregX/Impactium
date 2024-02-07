import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { useLanguage } from '../language/Lang';
import { useUser } from '../../class/User';
import { useHeaderContext } from './HeaderContext';
import Nav from './Nav'

function Header() {
  const { isFlattenHeader } = useHeaderContext();
  const { lang } = useLanguage();
  const { user, logout } = useUser();

  useEffect(() => {
    const logo = document.querySelector('.logo');
    logo.classList.add('inner-animation');
  }, []);

  return (
    <header className={`${isFlattenHeader ? 'flatten' : ''}`} >
      <Link to='/' className="logo flex flex-dir-row align-center">
        <img src="https://cdn.impactium.fun/logo/impactium_v4.svg" alt="Impactium Logo" />
        <p>Impactium</p>
      </Link>
      <Nav />
      {user && user.id ? (
        <div className="user-onlogin">
          {user.isVerified ? (
            <div className="verified">
              <img src="https://cdn.impactium.fun/ux/verified.svg" />
            </div>
          ) : null}
          <Link to="/me/account" className="user flex">
            {user.avatar && <img src={user.avatar} className="avatar" alt="User Avatar" />}
            <div>
              <p className="button-text">{user.displayName}</p>
              <p className="balance">{user.balance || 0}</p>
            </div>
          </Link>
          <button id="logout" onClick={() => logout()} className="temp-button">
            <div className="circle">
              <svg id="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                <path d="M18 12H18M18 12L13 7M18 12L13 17" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="button-text">{lang.logout}</div>
          </button>
        </div>
      ) : (
        <div className="flex-dir-row gap login-wrapper">
          <Link to="/login" className="login temp-button">
            <div className="circle">
              <svg id="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                <path d="M18 12H18M18 12L13 7M18 12L13 17" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="button-text txt-sh">{lang.login}</span>
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;