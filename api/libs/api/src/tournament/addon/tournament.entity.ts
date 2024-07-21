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

  static selectWithTeams(): Prisma.TournamentFindManyArgs {
    return this.findActual({
      select: {
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
        teams: {
          select: TeamEntity.selectWithMembers()
        },
      },
    });
  }

  static findActual(args: Partial<Prisma.TournamentFindManyArgs> = {}): Prisma.TournamentFindManyArgs {
    return {
      ...args,
      where: {
        ...args.where,
      },
      orderBy: {
        start: 'asc',
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
