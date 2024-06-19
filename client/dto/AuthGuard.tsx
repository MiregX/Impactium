import { redirect } from 'next/navigation'
import { User } from './User';
import { Guard, Options } from './Guard'


export function AuthGuard(user: User, options?: Options) {
  return Guard(user, {
    key: 'uid',
    ...options
  })
}
