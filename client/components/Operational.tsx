'use client'
import { useLanguage } from '@/context/Language';
import s from './styles/Footer.module.css'
import Link from 'next/link';

export function Operational() {
  const { lang } = useLanguage();
  return (
    <div className={s.operational}>
      <div className={s.left}>
        <img src='https://cdn.impactium.fun/logo/impactium_thin.svg'/>
        <p>© {new Date(Date.now()).getFullYear()}</p>
        <Link href='/status' className={s.status}>
          {lang.status.ok}
        </Link>
      </div>
      <div className={s.right}>

      </div>
    </div>
  );
};
