import { Team } from "./Team";

export interface User {
  uid: string,
  register: string,
  email?: string,
  balance: number,
  login: {
    uid: string,
    id: string,
    type: 'discord' | 'google' | 'github' | 'telegram' | 'steam',
    on: string,
    avatar: string,
    displayName: string,
    lang: string,
  }
  teams?: Team[] | false,
}