'use client'
import { useLanguage } from '@/context/Language';
import { useUser } from '@/context/User';
import _user from '@/components/header/User.module.css'
import Image from 'next/image';
import Link from "next/link";
import { useState } from 'react';

export function UserComponent() {
  const { user, logout } = useUser();
  const { lang, toggleIsLanguageChooserVisible } = useLanguage();
  const [active, setActive] = useState<boolean>(false);

  const toggle = () => {
    setActive(!active);
  }

  const handle = (func: Function) => {
    toggle();
    func();
  }

  return (
    <div className={_user.user}>
      <div onClick={toggle}>
        <Image className={_user.picture} src={user.avatar} width={30} height={30} alt="Avatar" />
      </div>
      <nav className={`${_user.menu} ${active && _user.active}`}>
        <p className={_user.name}>{user.email || '@' + user.displayName.toLowerCase()}</p>
        <Link href='/me/account' onClick={toggle}>
          {lang.account}
          <img src='https://cdn.impactium.fun/ui/user/card-id.svg' alt=''/>
        </Link>
        <Link href='/me/settings' onClick={toggle}>
          {lang.settings}
          <img src='https://cdn.impactium.fun/ui/action/settings-future.svg' alt=''/>
        </Link>
        <hr />
        <button onClick={() => handle(toggleIsLanguageChooserVisible)}>
          {lang.chooseLanguages}
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