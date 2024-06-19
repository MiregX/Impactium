import { redirect } from 'next/navigation'
import { User } from './User';
import { Guard, Options } from './Guard'

export function VerifiedGuard(user: User, options?: Options) {
  return Guard(user, {
    key: 'verified',
    ...options
  });
}
