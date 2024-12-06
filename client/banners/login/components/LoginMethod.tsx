'use client'
import s from '../LoginBanner.module.css'
import { _server } from '@/decorator/api'
import Link from 'next/link';
import { Badge, BadgeType } from '@/ui/Badge';
import { LoginMethod as LoginMethods } from '@/types';
import { cn } from '@impactium/utils';
import { Button } from '@impactium/components';
import Image from 'next/image';
import { capitalize } from '@impactium/utils';

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