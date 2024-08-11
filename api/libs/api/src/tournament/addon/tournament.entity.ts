import { TeamEntity } from "@api/main/team/addon/team.entity";
import { Prisma, Roles, Team, Tournament } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export class TournamentEntity<T = {}> implements Tournament {
  id: string;
  banner: string;
  title: string;
  start: Date;
  end: Date;
  description: Prisma.JsonValue;
  code: string;
  rules: Prisma.JsonValue;
  ownerId: string;
  gid: string;
  live: string;
  prize: number;

  static getLogoPath(filename: string) {
    const ftp = `/public/uploads/tournaments/${filename}`
    return {
      ftp,
      cdn: 'https://cdn.impactium.fun' + ftp
    }
  }

  static select({ teams }: Options = {}) {
    return {
      id: true,
      banner: true,
      title: true,
      start: true,
      end: true,
      description: true,
      code: true,
      rules: true,
      ownerId: true,
      gid: true,
      live: true,
      prize: true,
      teams: teams && {
        select: TeamEntity.select({ members: true }),
      },
    };
  }

  static findActual() {
    return {
      where: {
        end: {
          gt: new Date().toISOString()
        }
      },
      orderBy: {
        start: 'asc' as Prisma.SortOrder,
      },
    };
  }
}

export interface TournamentEntityWithTeams {
  teams: {
    avatar: string;
    roles: Roles[];
    uid: string;
  }[];
};

interface Options {
  teams?: boolean;
}