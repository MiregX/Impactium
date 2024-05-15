import { $Enums, Roles, Team, TeamMembers } from "@prisma/client";

export class TeamEntity implements Team {
  logo: string;
  membersAmount: number;
  indent: string;
  title: string;
  ownerId: string;

  static getLogoPath(filename: string) {
    const ftp = `/public/uploads/${filename}`
    return {
      ftp,
      cdn: 'https://cdn.impactium.fun' + ftp
    }
  }
}

export class TeamEntity_ComposedWithMembers extends TeamEntity {
  members: {
    avatar: string,
    roles: Roles[],
    uid: string,
  }[];
}