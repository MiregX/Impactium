'use client'
import { useLanguage } from '@/context/Language.context';
import { useUser } from '@/context/User.context';
import _user from './styles/User.module.css'
import Image from 'next/image';
import Link from "next/link";
import { useState } from 'react';
import { useApplication } from '@/context/Application.context';
import { LanguageChooser } from '@/banners/language/LanguageChooser';
import { Avatar } from './Avatar';

export function UserComponent() {
  const { user, logout } = useUser();
  const { spawnBanner } = useApplication();
  const { lang } = useLanguage();
  const [active, setActive] = useState<boolean>(false);

  const toggle = () => {
    setActive(!active);
  }

  const handle = (func: Function) => {
    toggle();
    func();
  }

  return (
    <div className={`${_user.user} ${active && _user.active}`}>
      <div className={_user.action_lock} onClick={toggle} />
      <Avatar
        className={_user.wrapper}
        size={36}
        alt={user!.displayName}
        src={user!.avatar}
        onClick={toggle} />
      <nav className={_user.menu}>
        <p className={_user.name}>{user!.email || user!.displayName}</p>
        {user!.uid === 'system' && (
          <Link href='/admin' onClick={toggle}>
            {lang._admin_panel}
            <img src='https://cdn.impactium.fun/ui/specific/star.svg' alt=''/>
          </Link>
        )}
        <Link href='/account' onClick={toggle}>
          {lang._account}
          <img src='https://cdn.impactium.fun/ui/user/card-id.svg' alt=''/>
        </Link>
        <hr />
        <Link href='/account#balance' onClick={toggle}>
          {lang.balance.top_up}
          <div style={{ fontFamily: 'var(--font-mono)'}}>{user!.balance | 0}$</div>
        </Link>
        <button onClick={() => handle(() => spawnBanner(<LanguageChooser />))}>
          {lang.choose.language}
          <img src='https://cdn.impactium.fun/ui/specific/globe.svg' alt=''/>
        </button>
        <hr />
        <button onClick={() => handle(logout)}>
          {lang.logout}
          <img src='https://cdn.impactium.fun/ui/action/log-out.svg' alt=''/>
        </button>
      </nav>
    </div>
  );
}