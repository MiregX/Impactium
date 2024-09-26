import { TeamInvite } from "./TeamInvite.dto";

export class NewTeamInviteRequest {  
  public static create = ({ maxUses }: Pick<TeamInvite, 'maxUses'>) => JSON.stringify({ maxUses })
}