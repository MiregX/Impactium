'use client'
import { useLanguage } from '@/context/Language'
import s from '../LoginBanner.module.css'
import { _server } from '@/dto/master'
import Link from 'next/link';
import Cookies from 'universal-cookie';
export function LoginMethod({ Type, disabled, useCrypto }: {
  Type: string,
  disabled?: boolean
  useCrypto?: boolean
}) {
  const { lang } = useLanguage();
  const cookie = new Cookies();
  const type = Type.toLowerCase();

  const uuid = useCrypto ? crypto.randomUUID() : ''

  const setup = () => {
    cookie.set('login_method', type);
    cookie.set('login_uuid', uuid);
  }

  return (
    <Link 
      href={`${_server()}/api/oauth2/${type}/login/${uuid}`}
      onClick={useCrypto && setup}
      className={`${s.method} ${disabled && s.disabled}`}>
        <img src={`https://cdn.impactium.fun/tech/${type}.png`} />
        <p className={s.text}>{Type}</p>
        {disabled && <p className={s.soon}><span />{lang._soon}</p>}
    </Link>
  )
}