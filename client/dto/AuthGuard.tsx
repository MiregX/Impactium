import { redirect } from 'next/navigation'

export function AuthGuard(user: any) {
  if (!user || !user.uid) {
    redirect('/login');
  }
}
