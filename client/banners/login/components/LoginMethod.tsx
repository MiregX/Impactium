'use client'
import s from '../Login.module.css'
import Link from 'next/link';
import { Badge } from '@impactium/components';
import { cn } from '@impactium/utils';
import { Button } from '@impactium/components';
import Image from 'next/image';
import { capitalize } from '@impactium/utils';
import { Configuration } from '@impactium/config';
import { TelegramWidget } from './TelegramWidget';
import { Login } from '../Login';

interface LoginMethodProps {
  type: Login.Interface['type'],
  disabled?: boolean
}

export function LoginMethod({ type, disabled }: LoginMethodProps) {
  if (type === 'telegram' && Configuration.isProductionMode()) {
    return <TelegramWidget />;

  }

  return (
    <Button asChild>
      <Link
        prefetch={false}
        href={`/api/oauth2/${type}/login`}
        className={cn(s.method, disabled && s.disabled, s[type])}>
        Login with {capitalize(type)}
      </Link>
    </Button>
  )
}