"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import s from './styles/Header.module.css';
import { Button } from '@impactium/components';
import { useUser } from '@/context/User.context';
import { UserComponent } from './User';
import { useLanguage } from '@/context/Language.context';
import { LoginBanner } from '@/banners/login/Login.banner';
import { useApplication } from '@/context/Application.context';
import { LanguageChooser } from '@/banners/language/LanguageChooser';
import { cn } from '@impactium/utils';
import { Icon } from '@impactium/icons/dist';

export function Header() {
  const { user } = useUser();
  const { lang } = useLanguage();
  const { spawnBanner, application } = useApplication();
  const [hidden, setHidden] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof hidden === 'object') {
      const hidden = window.localStorage.getItem('visitedBefore');
      setHidden(!hidden);
    }
  }, [hidden]);

  return (
    <header className={s.header}>
      <Link href='/' className={cn(s.logo, hidden && s.hidden)}>
        <Icon name='LogoImpactium' size={32} />
        <h1>Impactium</h1>
      </Link>
      {user?.uid ? (
        <UserComponent />
      ) : (
        <div className={s.wrapper}>
          <Button rounded variant='secondary' onClick={() => spawnBanner(<LoginBanner />)}>{lang._login}</Button>
          <Button rounded img='Globe' variant='secondary' onClick={() => spawnBanner(<LanguageChooser />)} />
        </div>
      )}
    </header>
  );
}