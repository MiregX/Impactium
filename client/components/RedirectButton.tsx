'use client'
import s from '@/styles/Login.module.css';
import type { LoginMethod } from '@/app/login/page';
import { useRouter } from 'next/navigation';
import { _server } from '@/dto/master';
import { useLanguage } from '@/context/Language';

export function RedirectButton({ type }: { type: LoginMethod }) {
  const { lang } = useLanguage();
  const router = useRouter();
  
  const login = (type: LoginMethod) => {
    router.push(`${_server()}/api/oauth2/login/${type}`);
  }

  const map = {
    github: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
    discord: 'https://cdn.impactium.fun/custom/discord.svg'
  };

  return (
    <button onClick={() => login(type)} className={s.baseButton} accessKey={type}>
      <img src={map[type]} alt={`${type}-icon`} />
      <p>{`${lang.login[`continue_with_${type}`]}`}</p>
    </button>
  );
}