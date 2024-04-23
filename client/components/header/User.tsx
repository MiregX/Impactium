'use client'
import { useLanguage } from '@/context/Language';
import { useUser } from '@/context/User';
import _user from '@/styles/header/User.module.css'
import Image from 'next/image';

import Link from "next/link";

export function UserComponent() {
  const { user } = useUser();
  const { lang } = useLanguage();

  const open = () => {

  }

  return (
    <div className={_user.user}>
      <Image className={_user.picture} onClick={open} src={user.avatar} width={30} height={30} alt="Avatar" />
      <div className={`${_user.menu} ${_user.opened}`}>
        <p>{user.email || '@' + user.displayName.toLowerCase()}</p>
        <Link href='/account'>
          {lang.account}
          <img src='https://cdn.impactium.fun/ui/action/settings.svg' alt=''/>
        </Link>
        <hr />
        <Link href='/settings'>{lang.settings}</Link>
      </div>
    </div>
  );
}