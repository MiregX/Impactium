export interface Login {
  id: string;
  uid: string;
  type: 'discord' | 'steam' | 'telegram';
  avatar: string;
  displayName: string;
  on: Date;
}
