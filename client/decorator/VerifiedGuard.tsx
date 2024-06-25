import { User } from '@/dto/User';
import { guard, Options } from './guard'

export const verifiedGuard = (user: User, options?: Options) => guard(user, {
  key: 'verified',
  ...options
});
