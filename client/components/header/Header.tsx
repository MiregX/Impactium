"use client"
import React from 'react';
import Link from 'next/link';
import s from '@/components/header/Header.module.css';
import { BaseButton, BaseButtonTypes } from '@/ui/BaseButton';
import { useUser } from '@/context/User';
import { useHeader } from '@/context/Header';
import { UserComponent } from './User';
import { useLanguage } from '@/context/Language';

export function Header() {
  const { user } = useUser();
  const { lang } = useLanguage();
  const { isFlattenHeader, isLogoHidden } = useHeader();

  return (
    <header className={`${s.header} ${isFlattenHeader && s.flatten}`}>
      <Link href='/' className={`${s.logo} ${isLogoHidden && s.hidden}`}>
        <img src="https://cdn.impactium.fun/logo/impactium.svg" alt='' />
        <p>Impactium</p>
      </Link>
      {user?.id ? (
        <UserComponent />
      ) : (
        <BaseButton type={BaseButtonTypes.link} text={lang._login} href='/login' />
      )}
    </header>
  );
}