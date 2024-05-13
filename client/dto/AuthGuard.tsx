import { UserEntity } from '@api/main/user/addon/user.entity'
import { redirect } from 'next/navigation'

export function AuthGuard(user: UserEntity) {
  if (!user || !user.uid) {
    redirect('/login');
  }
}
