
type Languages = 'us' | 'ua' | 'ru' | 'it';
type LoginTypes = 'discord' | 'google';

export interface FulfilledUser {
  id: string,
  uid: string
  lastLogin: LoginTypes,
  register: Date,
  email: string | null,
  avatar: string,
  displayName: string,
  locale: string,
}