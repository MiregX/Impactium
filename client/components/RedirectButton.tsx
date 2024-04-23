'use client'
import s from '@/styles/Login.module.css';
import type { LoginMethod } from '@/app/login/page';
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
    github: 'https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg',
    discord: 'https://cdn.impactium.fun/custom/discord.svg'
  };

  return (
    <button onClick={() => login(type)} className={s.baseButton} accessKey={type}>
      <img src={map[type]} alt={`${type}-icon`} />
      <p>{`${lang[`continueWith${type}`]}`}</p>
    </button>
  );
}