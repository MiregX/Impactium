'use client'
import { useLanguage } from '@/context/Language';
import { useUser } from '@/context/User';
import _user from './User.module.css'
import Image from 'next/image';
import Link from "next/link";
import { useState } from 'react';
import { useApplication } from '@/context/Application';
import { LanguageChooser } from '@/banners/language/LanguageChooser';
import { Avatar } from '../avatar/Avatar';

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
        size={32}
        alt={UseUsername(user)}
        src={user.login.avatar}
        onClick={toggle} />
      <nav className={_user.menu}>
        <p className={_user.name}>{user.email || UseUsername(user)}</p>
        <Link href='/account' onClick={toggle}>
          {lang._account}
          <img src='https://cdn.impactium.fun/ui/user/card-id.svg' alt=''/>
        </Link>
        <hr />
        <Link href='/account#balance' onClick={toggle}>
          {lang.balance.top_up}
          <div style={{ fontFamily: 'var(--mono-geist)'}}>{user.balance | 0}$</div>
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