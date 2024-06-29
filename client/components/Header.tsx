"use client"
import React from 'react';
import Link from 'next/link';
import s from './styles/Header.module.css';
import { Button, ButtonTypes } from '@/ui/Button';
import { useUser } from '@/context/User';
import { useHeader } from '@/context/Header';
import { UserComponent } from './User';
import { useLanguage } from '@/context/Language';
import { LoginBanner } from '@/banners/login/LoginBanner';
import { useApplication } from '@/context/Application';
import { LanguageChooser } from '@/banners/language/LanguageChooser';

export function Header() {
  const { user } = useUser();
  const { lang } = useLanguage();
  const { isLogoHidden } = useHeader();
  const { spawnBanner } = useApplication();

  return (
    <header className={s.header}>
      <Link href='/' className={`${s.logo} ${isLogoHidden && s.hidden}`}>
        <img src="https://cdn.impactium.fun/logo/impactium.svg" alt='' />
        <h1>Impactium</h1>
      </Link>
      {user?.uid ? (
        <UserComponent />
      ) : (
        <div className={s.wrapper}>
          <Button options={{
            type: ButtonTypes.Button,
            text: lang._login,
            do: () => spawnBanner(<LoginBanner />),
          }} />
          <Button options={{
            type: ButtonTypes.Button,
            text: '',
            img: 'https://cdn.impactium.fun/ui/specific/globe.svg',
            do: () => spawnBanner(<LanguageChooser />),
            className: s.languageChooser
          }} />
        </div>
      )}
    </header>
  );
}