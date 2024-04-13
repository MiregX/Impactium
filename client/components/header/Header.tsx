"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import s from '@/styles/header/Header.module.css';
import { DynamicBubbleButton } from '@/components/DynamicBubbleButton';
import { useUser } from '@/context/User';
import { useHeader } from '@/context/Header';
import { Nav } from '@/components/header/Nav';

export function Header() {
  const { user } = useUser();
  const { isFlattenHeader, isLogoHiiden } = useHeader();

  return (
    <header className={`${s.header} ${isFlattenHeader && s.flatten}`}>
      <Link href='/' className={`${s.logo} ${isLogoHiiden && s.hidden}`}>
        <Image src="https://cdn.impactium.fun/logo/impactium.svg" height={48} width={37} alt="Impactium" />
        <p>Impactium</p>
      </Link>
      <Nav />
      {user && user.id ? (
        <div className={s.session}>
          {user.isVerified && (
            <div className={s.verified}>
              <Image src="https://cdn.impactium.fun/ui/wavy/check.svg" height={24} width={24} alt='' />
            </div>
          )}
          <Link href="/me/account" className={s.user}>
            <div className={s.avatar}>
              <Image src={user.avatar} width={30} height={30} alt="Avatar" />
            </div>
            <p>{user.displayName}</p>
          </Link>
          <DynamicBubbleButton type='logout' />
        </div>
      ) : (
        <div className={s.session}>
          <DynamicBubbleButton type='login' />
        </div>
      )}
    </header>
  );
}