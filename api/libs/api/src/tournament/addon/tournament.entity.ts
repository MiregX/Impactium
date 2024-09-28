import { TeamEntity } from "@api/main/team/addon/team.entity";
import { UserEntity } from "@api/main/user/addon/user.entity";
import { Prisma, Role, Tournament } from "@prisma/client";
import { GridEntity } from "./grid.entity";

export class TournamentEntity<T = {}> implements Tournament {
  id!: string;
  banner!: string;
  title!: string;
  start!: Date;
  end!: Date;
  description!: Prisma.JsonValue | null;
  code!: string;
  rules!: Prisma.JsonValue | null;
  ownerId!: string;
  gid!: string;
  live!: string | null;
  prize!: number;

  static getLogoPath(filename: string) {
    const ftp = `/public/uploads/tournaments/${filename}`
    return {
      ftp,
      cdn: 'https://cdn.impactium.fun' + ftp
    }
  }

  static select({ teams = false, owner = false, grid = false }: Options = {}) {
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
      grid: grid && {
        select: GridEntity.select({ teams: true })
      },
      live: true,
      prize: true,
      teams: teams && {
        select: TeamEntity.select({ members: true }),
      },
      owner: owner && {
        select: UserEntity.select()
      }
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
    role: Role;
    uid: string;
  }[];
};

interface Options {
  teams?: boolean;
  owner?: boolean;
  grid?: boolean;
}