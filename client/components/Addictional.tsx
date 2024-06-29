'use client'
import { useLanguage } from '@/context/Language';
import s from './styles/Footer.module.css';
import Link from 'next/link';

export function Addictional() {
  const { lang } = useLanguage();

  return (
    <div className={s.addictional}>
      <div className={s.socials}>
        <Link href='https://github.com/Mireg-V'>
          <img src='https://cdn.impactium.fun/custom/github.svg' />
        </Link>
        <Link href='https://t.me/impactium'>
          <img src='https://cdn.impactium.fun/custom/telegram.svg' />
        </Link>
      </div>
      <div className={s.navigation}>
        <Link href='/teams'>{lang.footer.teams}</Link>
        <Link href='/tournaments'>{lang.footer.tournaments}</Link>
        <Link href='/documentation'>{lang.footer.documentation}</Link>
        <Link href='/services'>{lang.footer.services}</Link>
        <Link href='/developers'>{lang.footer.developers}</Link>
        <Link href='/privacy-policy'>{lang.footer.privacy}</Link>
        <Link href='/terms-of-service'>{lang.footer.terms}</Link>
        <Link href='/changelog'>{lang.footer.changelog}</Link>
      </div>
    </div>
  );
}
