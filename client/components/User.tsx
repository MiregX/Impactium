'use client'
import { useLanguage } from '@/context/Language.context';
import { useUser } from '@/context/User.context';
import _user from './styles/User.module.css'
import Image from 'next/image';
import Link from "next/link";
import { useState } from 'react';
import { useApplication } from '@/context/Application.context';
import { LanguageChooser } from '@/banners/language/LanguageChooser';
import { Avatar } from '../ui/Avatar';
import { Icon } from '@/ui/Icon';

export function UserComponent() {
  const { user, logout } = useUser();
  const { spawnBanner } = useApplication();
  const { lang } = useLanguage();
  const [active, setActive] = useState<boolean>(false);

  const toggle = () => {
    setActive((active) => !active);
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
            <Icon name='Fingerprint' />
          </Link>
        )}
        <Link href='/account' onClick={toggle}>
          {lang._account}
          <Icon name='CreditCard' />
        </Link>
        <hr />
        <Link href='/account#balance' onClick={toggle}>
          {lang.balance.top_up}
          <div style={{ fontFamily: 'var(--font-mono)'}}>{user!.balance | 0}$</div>
        </Link>
        <button onClick={() => handle(() => spawnBanner(<LanguageChooser />))}>
          {lang.choose.language}
          <Icon name='Globe' />
        </button>
        <hr />
        <button onClick={() => handle(logout)}>
          {lang.logout}
          <Icon name='LogOut' />
        </button>
      </nav>
    </div>
  );
}