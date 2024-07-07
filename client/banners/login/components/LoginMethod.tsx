'use client'
import { useLanguage } from '@/context/Language.context'
import s from '../LoginBanner.module.css'
import { _server } from '@/decorator/api'
import Link from 'next/link';
import Cookies from 'universal-cookie';
import { Badge, BadgeType } from '@/ui/Badge';
export function LoginMethod({ Type, disabled }: {
  Type: string,
  disabled?: boolean
}) {
  const { lang } = useLanguage();
  const cookie = new Cookies();
  const type = Type.toLowerCase();

  const setup = () => {
    cookie.set('login_method', type);
  }

  return (
    <Link
      href={`${_server()}/api/oauth2/${type}/login`}
      className={`${s.method} ${disabled && s.disabled}`}>
        <img src={`https://cdn.impactium.fun/tech/${type}.png`} />
        {disabled && <Badge type={BadgeType.Soon}></Badge>}
    </Link>
  )
}