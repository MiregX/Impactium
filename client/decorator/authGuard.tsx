import { guard, Options } from './guard'

export function authGuard(options?: Options) {
  return guard({
    key: 'uid',
    ...options
  })
}
