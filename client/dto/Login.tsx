export interface Login {
  id: string;
  uid: string;
  type: 'discord' | 'steam' | 'telegram' | 'native';
  avatar: string;
  displayName: string;
  on: Date;
}
