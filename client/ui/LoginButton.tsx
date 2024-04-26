import s from '@/ui/styles/LoginButton.module.css';
import { useLanguage } from '@/context/Language';
import Link from 'next/link';
import React from 'react';

export function LoginButton() {
  const { lang } = useLanguage();

  return (
    <Link className={s.loginButton} href='/login'>
      <p>{lang.login}</p>
    </Link>
  );
}
