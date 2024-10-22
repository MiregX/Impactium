'use client'
import { redirect } from 'next/navigation'
import { User } from '@/dto/User.dto';
import { useUser } from '@/context/User.context';

interface _Options extends Options {
  key: keyof User;
}

export interface Options {
  // Нужно использовать редирект, или вернуть boolean значение
  useRedirect?: boolean
}

export function guard(options: _Options) {
  const { user } = useUser();
  const next = user && user[options.key];
  return next ? next : (options.useRedirect ? redirect('/') : next)
}
