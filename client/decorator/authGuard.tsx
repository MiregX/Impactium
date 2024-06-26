import { redirect } from 'next/navigation'
import { User } from '@/dto/User';
import { guard, Options } from './guard'


export function authGuard(user: User | null, options?: Options) {
  return guard(user, {
    key: 'uid',
    ...options
  })
}
