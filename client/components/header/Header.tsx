"use client"
import React from 'react';
import Link from 'next/link';
import s from '@/styles/header/Header.module.css';
import { DynamicBubbleButton } from '@/components/DynamicBubbleButton';
import { useUser } from '@/context/User';
import { useHeader } from '@/context/Header';
import { Nav } from '@/components/header/Nav';
import { UserComponent } from './User';

export function Header() {
  const { user } = useUser();
  const { isFlattenHeader, isLogoHidden } = useHeader();

  return (
    <header className={`${s.header} ${isFlattenHeader && s.flatten}`}>
      <Link href='/' className={`${s.logo} ${isLogoHidden && s.hidden}`}>
        <img src="https://cdn.impactium.fun/logo/impactium.svg" alt='' />
        <p>Impactium</p>
      </Link>
      <Nav />
      {user?.id ? (
        <UserComponent />
      ) : (
        <div className={s.session}>
          <DynamicBubbleButton type='login' />
        </div>
      )}
    </header>
  );
}