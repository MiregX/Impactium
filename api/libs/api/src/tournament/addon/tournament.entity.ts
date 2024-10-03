import { TeamEntity } from "@api/main/team/addon/team.entity";
import { UserEntity } from "@api/main/user/addon/user.entity";
import { $Enums, Iteration, Prisma, Role, Tournament } from "@prisma/client";
import { FormatEntity } from "./format.entity";
import { IterationEntity } from "./iteration.entity";

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
  live!: string | null;
  prize!: number;
  createdAt!: Date;
  eliminationType!: $Enums.EliminationType;
  iterations?: Iteration[];
  formats?: FormatEntity[];

  static getLogoPath(filename: string) {
    const ftp = `/public/uploads/tournaments/${filename}`
    return {
      ftp,
      cdn: 'https://cdn.impactium.fun' + ftp
    }
  }

  static select = ({ teams = false, owner = false, iterations = false, formats = true }: Options = {}) => ({
    id: true,
    banner: true,
    title: true,
    start: true,
    end: true,
    description: true,
    code: true,
    rules: true,
    ownerId: true,
    live: true,
    prize: true,
    teams: teams && {
      select: TeamEntity.select({ members: true }),
    },
    owner: owner && {
      select: UserEntity.select()
    },
    iterations: iterations && {
      select: IterationEntity.select()
    },
    formats: formats && {
      select: FormatEntity.select()
    }
  })

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
  iterations?: boolean;
  formats?: boolean;
}