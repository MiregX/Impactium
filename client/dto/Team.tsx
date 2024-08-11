import { TeamMember } from "./TeamMember";

export interface Team {
  indent: string,
  logo: null | string,
  title: string,
  ownerId: string,
  description: string,
  membersAmount: number,
  members?: Array<TeamMember>,
  comments: Array<Comment>,
  registered: number,
}