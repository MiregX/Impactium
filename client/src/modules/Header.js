import React, { useEffect } from 'react';
import './Header.css';

function Header({ user, lang }) {
  useEffect(() => {
    const arrowIcon = document.querySelector('.temp-button');

    const handleMouseEnter = () => {
      document.getElementById('arrow-icon').classList.add('hovered');
    };

    const handleMouseLeave = () => {
      document.getElementById('arrow-icon').classList.remove('hovered');
    };

    arrowIcon.addEventListener('mouseenter', handleMouseEnter);
    arrowIcon.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      arrowIcon.removeEventListener('mouseenter', handleMouseEnter);
      arrowIcon.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const logo = document.querySelector('.logo');
    logo.classList.add('inner-animation');
  }, []);

  const logout = () => {
    window.location.href = "/logout";
  }

  const login = () => {
    window.location.href = "/login";
  }
  
  const me = () => {
    window.location.href = "/me";
  }

  const toHub = () => {
    window.location.href = "https://impactium.fun";
  }

  return (
    <header>
      <div style={{ gap: '16px', opacity: 0 }} onClick={toHub} className="logo flex flex-dir-row align-center">
        <img src="https://api.impactium.fun/logo/impactium_v4.svg" style={{ height: '48px' }} alt="Impactium Logo" />
        <p style={{ fontSize: '30px', fontWeight: 600 }}>Impactium</p>
      </div>
      {user && user.id ? (
        <div className="user-onlogin" style={{ justifyContent: 'flex-end' }}>
          <button onClick={me} className="user flex">
            {user.avatar && <img src={user.avatar} className="avatar" alt="User Avatar" />}
            <div>
              <p className="button-text">{user.displayName}</p>
              <p className="balance">{user.balance || 0}</p>
            </div>
          </button>
          <button id="logout" onClick={logout} className="temp-button">
            <div className="circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                <path d="M18 12H18M18 12L13 7M18 12L13 17" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="button-text">{lang.logout}</div>
          </button>
        </div>
      ) : (
        <div className="flex-dir-row gap login-wrapper" style={{ justifyContent: 'flex-end' }}>
          <button onClick={login} className="login temp-button">
            <div className="circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                <path d="M18 12H18M18 12L13 7M18 12L13 17" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="button-text txt-sh">{lang.login}</span>
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
