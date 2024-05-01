"use client"
import React from 'react';
import Link from 'next/link';
import s from '@/components/header/Header.module.css';
import { GeistButton, GeistButtonTypes } from '@/ui/GeistButton';
import { useUser } from '@/context/User';
import { useHeader } from '@/context/Header';
import { UserComponent } from './User';
import { useLanguage } from '@/context/Language';

export function Header() {
  const { user } = useUser();
  const { lang } = useLanguage();
  const { isLogoHidden } = useHeader();

  return (
    <header className={s.header}>
      <Link href='/' className={`${s.logo} ${isLogoHidden && s.hidden}`}>
        <img src="https://cdn.impactium.fun/logo/impactium.svg" alt='' />
        <h1>Impactium</h1>
      </Link>
      {user?.id ? (
        <UserComponent />
      ) : (
        <GeistButton options={{
          type: GeistButtonTypes.Link,
          text: lang._login,
          href: '/login',
        }} />
      )}
    </header>
  );
}