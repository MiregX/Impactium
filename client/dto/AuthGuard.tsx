import { redirect } from 'next/navigation'
import { User } from './User';

export function AuthGuard(user: User, fallback?: true) {
  if (!user || !user.uid) {
    fallback ? false : redirect('/login');
  } else {
    return true
  }
}
