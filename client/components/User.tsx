'use client'
import { useLanguage } from '@/context/Language.context';
import { useUser } from '@/context/User.context';
import s from './styles/User.module.css'
import Link from "next/link";
import { useState } from 'react';
import { useApplication } from '@/context/Application.context';
import { LanguageChooser } from '@/banners/language/LanguageChooser';
import { Avatar } from '../ui/Avatar';
import { Icon } from '@/ui/Icon';
import { Separator } from '@/ui/Separator';

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
    <div className={`${s.user} ${active && s.active}`}>
      <div className={s.action_lock} onClick={toggle} />
        <Avatar
          className={s.wrapper}
          size={36}
          alt={user!.displayName}
          src={user!.avatar}
          onClick={toggle} />
      <nav className={s.menu}>
        <p className={s.name}>{user!.email || user!.displayName}</p>
        {user!.uid === 'system' && (
          <Link href='/admin' onClick={toggle}>
            {lang._admin_panel}
            <Icon name='Fingerprint' />
          </Link>
        )}
        <Link href='/account' onClick={toggle}>
          {lang._account}
          <Icon name='Settings' variant='dimmed' />
        </Link>
        <Link href='/account/inventory' onClick={toggle}>
          {lang._inventory}
          <Icon name='PackageOpen' variant='dimmed' />
        </Link>
        <Separator />
        <Link href='/account#balance' onClick={toggle}>
          {lang.balance.top_up}
          <span>{user!.balance | 0}<Icon name='DollarSign' variant='dimmed' /></span>
        </Link>
        <button onClick={() => handle(() => spawnBanner(<LanguageChooser />))}>
          {lang.choose.language}
          <Icon name='Globe' variant='dimmed' />
        </button>
        <Separator />
        <button onClick={() => handle(logout)}>
          {lang.logout}
          <Icon variant='dimmed' name='LogOut' />
        </button>
      </nav>
    </div>
  );
}