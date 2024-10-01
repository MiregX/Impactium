import { Team } from "./Team.dto";

export interface TeamInvite {
  id: string;
  created: number;
  indent: Team['indent'];
  used: number;
  maxUses: number;
}
