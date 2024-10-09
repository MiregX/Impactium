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

export class ManageTeamRequest {
  public static create = ({ indent, title, logo, joinable, rawLogo }: Partial<Team> & { rawLogo?: File}) => {
    const form = new FormData();
    indent && form.append('indent', indent);
    title && form.append('title', title);
    joinable && form.append('joinable', joinable);
    rawLogo && form.append('logo', rawLogo);
    return form
  }
}

export class λTeam {
  public static find = (teams: Team[], indent: Team['indent'] | null) => teams.find(team => team.indent === indent);
}