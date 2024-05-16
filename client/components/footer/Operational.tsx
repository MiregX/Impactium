'use client'
import { useLanguage } from '@/context/Language';
import s from './Footer.module.css'

export function Operational() {
  const { lang } = useLanguage();
  return (
    <div className={s.operational}>
      <div className={s.left}>
        <img src='https://cdn.impactium.fun/logo/impactium_thin.svg'/>
        <p>© {new Date(Date.now()).getFullYear()}</p>
        <a className={s.status}>
          {lang.status.ok}
        </a>
      </div>
      <div className={s.right}>

      </div>
    </div>
  );
};
