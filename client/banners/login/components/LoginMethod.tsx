'use client'
import s from '../LoginBanner.module.css'
import { _server } from '@/decorator/api'
import Link from 'next/link';
import { Badge, BadgeType } from '@/ui/Badge';

interface LoginMethodProps {
  Type: string,
  disabled?: boolean
}

export function LoginMethod({ Type, disabled }: LoginMethodProps) {
  const type = Type.toLowerCase();

  return (
    <Link
      prefetch={false}
      href={`${_server()}/api/oauth2/${type}/login`}
      className={`${s.method} ${disabled && s.disabled}`}>
        <img src={`https://cdn.impactium.fun/tech/${type}.png`} />
        {disabled && <Badge type={BadgeType.Soon}></Badge>}
    </Link>
  )
}