"use client"
import React from 'react';
import Link from 'next/link';
import s from './styles/Header.module.css';
import { Button } from '@/ui/Button';
import { useUser } from '@/context/User.context';
import { UserComponent } from './User';
import { useLanguage } from '@/context/Language.context';
import { LoginBanner } from '@/banners/login/LoginBanner';
import { useApplication } from '@/context/Application.context';
import { LanguageChooser } from '@/banners/language/LanguageChooser';

export function Header() {
  const { user } = useUser();
  const { lang } = useLanguage();
  const { spawnBanner } = useApplication();

  return (
    <header className={s.header}>
      <Link href='/' className={`${s.logo} ${/* isLogoHidden */ undefined && s.hidden}`}>
        <img src="https://cdn.impactium.fun/logo/impactium.svg" alt='' />
        <h1>Impactium</h1>
      </Link>
      {user?.uid ? (
        <UserComponent />
      ) : (
        <div className={s.wrapper}>
          <Button variant='outline' onClick={() => spawnBanner(<LoginBanner />)}>{lang._login}</Button>
          <Button size='icon' variant='outline' onClick={() => spawnBanner(<LanguageChooser />)}><img src='https://cdn.impactium.fun/ui/specific/globe.svg' /></Button>
        </div>
      )}
    </header>
  );
}