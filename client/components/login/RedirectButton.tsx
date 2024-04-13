'use client'
import s from '@/styles/Login.module.css';
import type { LoginMethod } from './Page';
import { useRouter } from 'next/navigation';
import { getServerLink } from '@/dto/master';
import { useLanguage } from '@/context/Language';

export function RedirectButton({ type }: { type: LoginMethod }) {
  const { lang } = useLanguage();
  const router = useRouter();
  
  const login = (type: LoginMethod) => {
    router.push(`${getServerLink()}/api/oauth2/login/${type}`);
  }

  const map = {
    google: {
      icon: 'https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg'
    },
    discord: {
      icon: 'https://cdn.impactium.fun/custom/discord.svg'
    }
  };

  const x = map[type];

  return (
    <button onClick={() => login(type)} className={s.baseButton} accessKey={type}>
      <img src={x.icon} alt={`${type}-icon`} />
      <p>{`${lang[`continueWith${type}`]}`}</p>
    </button>
  );
}