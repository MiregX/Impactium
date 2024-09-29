'use client'
import s from '../LoginBanner.module.css'
import { _server } from '@/decorator/api'
import Link from 'next/link';
import { Badge, BadgeType } from '@/ui/Badge';
import { LoginMethod as LoginMethods } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/Button';
import { capitalize } from '@impactium/utils';
import Image from 'next/image';

interface LoginMethodProps {
  type: LoginMethods,
  disabled?: boolean
}

export function LoginMethod({ type, disabled }: LoginMethodProps) {
  return (
    <Button asChild>
      <Link
        prefetch={false}
        href={`${_server()}/api/oauth2/${type}/login`}
        className={cn(s.method, disabled && s.disabled, s[type])}>
        <Image src={`https://cdn.impactium.fun/tech/${type}.svg`} width={20} height={20} alt='' />
        {disabled && <Badge type={BadgeType.Soon} />}
        Login with {capitalize(type)}
      </Link>
    </Button>
  )
}