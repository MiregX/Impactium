'use client'
import { Language } from '@/context/Language.context';
import Link from 'next/link';
import s from '../Account.module.css';
import { Locale } from '@/public/locale';

export function Nav() {
  const { lang } = Language.use();
  const sections: (keyof Locale['account'])[] = ['avatar', 'displayName', 'username', 'email', 'connections'];

  return (
    <nav className={s.nav}>
      {sections.map(section => (
        <Link key={section} href={`#${section}`}>
          {lang.account[section]}
        </Link>
      ))}
    </nav>
  );
}
