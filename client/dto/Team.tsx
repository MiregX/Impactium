import { Joinable } from "./Joinable.dto";
import { TeamInvite } from "./TeamInvite.dto";
import { TeamMember } from "./TeamMember";
import { Tournament } from "./Tournament";
import { User } from "./User";

export interface Team {
  indent: string,
  logo: null | string,
  title: string,
  ownerId: string,
  owner: User | null,
  description: string,
  joinable: Joinable,
  members?: Array<TeamMember>,
  comments: Array<Comment>,
  registered: number,
  tournaments?: Array<Tournament>,
  invites?: TeamInvite[]
}
