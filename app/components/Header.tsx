"use client"
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Header.module.css';

function Header() {
  const [user, setUser] = useState({});
  const [lang, setLang] = useState({});
  const logo = useRef(null);
  useEffect(() => {
    if (logo) {
      logo.current.classList.add('inner-animation');
    }
  }, [logo]);

  return (
    <header className={styles.header}>
      <Link href='/' className={styles.logo}>
        <Image ref={logo} src="https://cdn.impactium.fun/logo/impactium_v4.svg" height={48} width={undefined} alt="Impactium" />
        <p>Impactium</p>
      </Link>
      {user && user.id ? (
        <div className={styles.onLogin}>
          {user.isVerified && (
            <div className={styles.verified}>
              <Image src="https://cdn.impactium.fun/ux/verified.svg" alt='' />
            </div>
          )}
          <Link href="/me/account" className={styles.user}>
            {user.avatar && <Image src={user.avatar} width={30} height={30} className={styles.avatar} alt="Avatar" />}
            <div>
              <p className={styles.buttonText}>{user.displayName}</p>
              <p className={styles.balance}>{user.balance || 0}</p>
            </div>
          </Link>
          <button id="logout" className={styles.tempButton}>
            <div className={styles.circle}>
              <svg id="arrow-icon" className={styles.arrow} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                <path d="M18 12H18M18 12L13 7M18 12L13 17" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className={styles.buttonText}>{lang.logout}</div>
          </button>
        </div>
      ) : (
        <div className={styles.loginWrapper}>
          <Link href="/login" className={styles.login}>
            <div className={styles.circle}>
              <svg id="arrow-icon" className={styles.arrow} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                <path d="M18 12H18M18 12L13 7M18 12L13 17" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className={styles.buttonText}>{lang.login}</span>
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;