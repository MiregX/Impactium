export interface Login {
  uid: string,
  id: string,
  type: 'discord' | 'telegram' | 'steam',
  on: string,
  avatar: string,
  displayName: string,
}