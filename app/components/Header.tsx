"use client"
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Header.module.css';
import DynamicBubbleButton from './DynamicBubbleButton';

export default function Header() {
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
        <Image ref={logo} src="https://cdn.impactium.fun/logo/impactium_v4.svg" height={48} width={37} alt="Impactium" />
        <p>Impactium</p>
      </Link>
      {user && user.id ? (
        <div className={styles.session}>
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
          <DynamicBubbleButton type='logout' />
        </div>
      ) : (
        <div className={styles.session}>
          <DynamicBubbleButton type='login' />
        </div>
      )}
    </header>
  );
}