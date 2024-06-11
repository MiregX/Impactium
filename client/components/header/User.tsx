'use client'
import { useLanguage } from '@/context/Language';
import { useUser } from '@/context/User';
import _user from './User.module.css'
import Image from 'next/image';
import Link from "next/link";
import { useState } from 'react';
import { useApplication } from '@/context/Application';
import { LanguageChooser } from '../../banners/language/LanguageChooser';

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
      <div className={_user.wrapper} onClick={toggle}>
        <Image className={_user.picture} src={user.login.avatar} width={30} height={30} alt="Avatar" />
      </div>
      <nav className={_user.menu}>
        <p className={_user.name}>{user.email || user.login.displayName}</p>
        <Link href='/account' onClick={toggle}>
          {lang._account}
          <img src='https://cdn.impactium.fun/ui/user/card-id.svg' alt=''/>
        </Link>
        <hr />
        <Link href='/account/balance' onClick={toggle}>
          {lang.balance.top_up}
          <div>
            {user.balance | 0}
            <img src='https://cdn.impactium.fun/ui/specific/coffee-coin.svg' alt=''/>
          </div>
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