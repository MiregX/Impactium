import { $Enums, Prisma, Roles, Team, TeamMembers } from "@prisma/client";

export class TeamEntity implements Team {
  logo: string;
  membersAmount: number;
  indent: string;
  title: string;
  description: string;
  ownerId: string;

  static getLogoPath(filename: string) {
    const ftp = `/public/uploads/${filename}`
    return {
      ftp,
      cdn: 'https://cdn.impactium.fun' + ftp
    }
  }
  
  static selectWithMembers() {
    return {
      indent: true,
      logo: true,
      title: true,
      ownerId: true,
      description: true,
      membersAmount: true,
      members: {
        select: {
          uid: true,
          roles: true,
          user: {
            select: {
              logins: {
                orderBy: {
                  on: 'desc' as Prisma.SortOrder
                },
                take: 1,
                select: {
                  avatar: true
                }
              }
            }
          }
        }
      }
    }
  };
}

export class TeamEntity_ComposedWithMembers extends TeamEntity {
  members: {
    avatar: string,
    roles: Roles[],
    uid: string,
  }[];
}