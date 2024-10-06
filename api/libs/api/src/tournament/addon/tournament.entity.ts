import { TeamEntity } from "@api/main/team/addon/team.entity";
import { UserEntity } from "@api/main/user/addon/user.entity";
import { $Enums, Iteration, Prisma, Role, Tournament } from "@prisma/client";
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
  has_lower_bracket!: boolean;
  iterations?: Iteration[];

  static getLogoPath(filename: string) {
    const ftp = `/public/uploads/tournaments/${filename}`
    return {
      ftp,
      cdn: 'https://cdn.impactium.fun' + ftp
    }
  }

  public static select = ({
    teams = false,
    owner = false,
    iterations = false,
    actual = false
  }: Options = {}): Prisma.TournamentDefaultArgs => ({
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
      live: true,
      prize: true,
      has_lower_bracket: true,
      createdAt: true,
      teams: teams && TeamEntity.select({ members: true }),
      owner: owner && UserEntity.select(),
      iterations: iterations && IterationEntity.select(),
    },
    ...(actual && this.sort())
  })
  

  public static sort = () => ({
    where: {
      end: {
        gt: new Date().toISOString()
      }
    },
    orderBy: {
      start: Prisma.SortOrder.asc,
    },
  });
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
  actual?: boolean;
}