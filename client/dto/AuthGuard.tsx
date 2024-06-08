import { redirect } from 'next/navigation'
import { User } from './User';

export function AuthGuard(user: User) {
  if (!user || !user.uid) {
    redirect('/login');
  }
}
