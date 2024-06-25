import { redirect } from 'next/navigation'
import { User } from '@/dto/User';
import { guard, Options } from './guard'


export function authGuard(user: User, options?: Options) {
  return guard(user, {
    key: 'uid',
    ...options
  })
}
