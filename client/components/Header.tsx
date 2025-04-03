'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import s from './styles/Header.module.css';
import { Button, Stack } from '@impactium/components';
import { User } from '@/context/User.context';
import { Language } from '@/context/Language.context';
import { Application } from '@/context/Application.context';
import { cn } from '@impactium/utils';
import { Icon } from '@impactium/icons/dist';
import { Login } from '@/banners/login/Login';

export function Header() {
  const { user } = User.use();
  const { lang } = Language.use();
  const { spawnBanner } = Application.use();
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
        <User.Component />
      ) : (
        <Stack jc='flex-end'>
          <Button rounded variant='secondary' onClick={() => spawnBanner(<Login.Banner />)}>{lang._login}</Button>
          <Button rounded img='Globe' variant='secondary' onClick={() => spawnBanner(<Language.Chooser />)} />
        </Stack>
      )}
    </header>
  );
}