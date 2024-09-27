import { Team } from "./Team";

export interface TeamInvite {
  id: string;
  created: number;
  indent: Team['indent'];
  used: number;
  maxUses: number;
}

export enum TeamInviteStatus {
  Valid = 'Valid',
  NotFound = 'NotFound',
  Expired = 'Expired',
  Used = 'Used'
}
