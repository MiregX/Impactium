"use client"
import React from 'react';
import Link from 'next/link';
import s from '@/components/header/Header.module.css';
import { LoginButton } from '@/ui/LoginButton';
import { useUser } from '@/context/User';
import { useHeader } from '@/context/Header';
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
      {user?.id ? (
        <UserComponent />
      ) : (
        <LoginButton />
      )}
    </header>
  );
}