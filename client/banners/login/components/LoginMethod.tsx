'use client'
import s from '../Login.module.css'
import Link from 'next/link';
import { cn } from '@impactium/utils';
import { Button } from '@impactium/components';
import { TelegramWidget } from './TelegramWidget';
import { Login } from '../Login';
import { capitalize } from 'lodash';

interface LoginMethodProps {
  type: Login.Interface['type'],
  disabled?: boolean
}

export function LoginMethod({ type, disabled }: LoginMethodProps) {
  if (type === 'telegram' && process.env.NODE_ENV === 'production') {
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