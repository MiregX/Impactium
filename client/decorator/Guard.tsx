import { redirect } from 'next/navigation'
import { User } from '@/dto/User';

interface _Options extends Options {
  key: string
}

export interface Options {
  // Нужно использовать редирект, или вернуть boolean значение
  useRedirect?: boolean
}

export function Guard(user: User, options: _Options) {
  const next = user && user[options.key];
  return next ? next : (options.useRedirect ? redirect('/') : next)
}
