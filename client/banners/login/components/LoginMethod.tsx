'use client'
import { useLanguage } from '@/context/Language'
import s from '../LoginBanner.module.css'
import { _server } from '@/dto/master'
import Link from 'next/link';
export function LoginMethod({ type, disabled }: {
  type: string,
  disabled?: boolean
}) {
  const { lang } = useLanguage();

  return (
    <Link  href={`${_server()}/api/oauth2/${type.toLowerCase()}/login`} className={`${s.method} ${disabled && s.disabled}`}>
      <img src={`https://cdn.impactium.fun/tech/${type.toLowerCase()}.png`} />
      <p className={s.text}>{type}</p>
      {disabled && <p className={s.soon}><span />{lang._soon}</p>}
    </Link>
  )
}