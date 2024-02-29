"use client"
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Header.module.css';
import { DynamicBubbleButton } from '@/components/DynamicBubbleButton';
import { useUser } from '@/context/User';
import { useHeader } from '@/context/Header';
import { Nav } from '@/components/header/Nav';

export function Header() {
  const { user } = useUser();
  const { isFlattenHeader, isLogoHiiden } = useHeader();
  const logo = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (logo.current) {
      logo.current.classList.add('inner-animation');
    }
  }, [logo]);

  return (
    <header className={`${styles.header} ${isFlattenHeader && styles.flatten}`}>
      <Link href='/' className={`${styles.logo} ${isLogoHiiden && styles.hidden}`}>
        <Image ref={logo} src="https://cdn.impactium.fun/logo/impactium_v4.svg" height={48} width={37} alt="Impactium" />
        <p>Impactium</p>
      </Link>
      <Nav />
      {user && user.id ? (
        <div className={styles.session}>
          {user.isVerified && (
            <div className={styles.verified}>
              <Image src="https://cdn.impactium.fun/ux/verified.svg" height={24} width={24} alt='' />
            </div>
          )}
          <Link href="/me/account" className={styles.user}>
            {user.avatar && <Image src={user.avatar} width={30} height={30} className={styles.avatar} alt="Avatar" />}
            <div>
              <p>{user.displayName}</p>
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