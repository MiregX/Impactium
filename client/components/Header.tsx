"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import s from './styles/Header.module.css';
import { Button } from '@/ui/Button';
import { useUser } from '@/context/User.context';
import { UserComponent } from './User';
import { useLanguage } from '@/context/Language.context';
import { LoginBanner } from '@/banners/login/Login.banner';
import { useApplication } from '@/context/Application.context';
import { LanguageChooser } from '@/banners/language/LanguageChooser';
import { cn } from '@/lib/utils';

export function   Header() {
  const { user } = useUser();
  const { lang } = useLanguage();
  const { spawnBanner, application } = useApplication();
  const [hidden, setHidden] = useState<boolean | null>(null);
  const [item, setItem] = useState<JSX.Element | null>(null);

  useEffect(() => {
    setItem(application.globalPhrase ? <p className={s.globalPhrase}>{application.globalPhrase}</p> : null)
  }, [application, application.globalPhrase]);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof hidden === 'object') {
      const hidden = window.localStorage.getItem('visitedBefore');
      setHidden(!hidden);
    }
  }, [hidden]);

  return (
    <header className={s.header}>
      {item}
      <Link href='/' className={cn(s.logo, hidden && s.hidden)}>
        <img src="https://cdn.impactium.fun/logo/impactium.svg" alt='' />
        <h1>Impactium</h1>
      </Link>
      {user?.uid ? (
        <UserComponent />
      ) : (
        <div className={s.wrapper}>
          <Button variant='outline' onClick={() => spawnBanner(<LoginBanner />)}>{lang._login}</Button>
          <Button size='icon' img='Globe' variant='outline' onClick={() => spawnBanner(<LanguageChooser />)} />
        </div>
      )}
    </header>
  );
}