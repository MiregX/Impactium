import { TeamEntity } from "@api/main/team/addon/team.entity";
import { UserEntity } from "@api/main/user/addon/user.entity";
import { Iteration, Prisma, Role, Tournament } from "@prisma/client";
import { IterationEntity } from "./iteration.entity";
import { BattleEntity } from "./battle.entity";
import { λParam } from "@impactium/pattern";
import { Arrayed } from "@impactium/utils";

export class TournamentEntity implements Tournament {
  code!: λParam.Code;
  banner!: string;
  title!: string;
  start!: Date;
  end!: Date;
  description!: Prisma.JsonValue | null;
  rules!: Prisma.JsonValue | null;
  ownerId!: string;
  live!: string | null;
  prize!: number;
  createdAt!: Date;
  has_lower_bracket!: boolean;
  iterations?: IterationEntity[];
  teams?: TeamEntity[];

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
      code: true,
      banner: true,
      title: true,
      start: true,
      end: true,
      description: true,
      rules: true,
      ownerId: true,
      live: true,
      prize: true,
      has_lower_bracket: true,
      createdAt: true,
      teams: teams && TeamEntity.select(),
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

  public static normalize = <T extends Arrayed<Tournament> | null>(tournaments: T) => (Array.isArray(tournaments)
    ? tournaments as TournamentEntity[]
    : tournaments) as T extends Tournament[]
      ? TournamentEntity[]
      : TournamentEntity | null;

  public static fulfill = (tournament: TournamentEntity | null) => {
    if (!tournament || !tournament.iterations) return null;
  
    tournament.iterations = tournament.iterations.map((iteration, i) => {
      if (!i || !iteration.battles) return iteration;

      const prev = tournament.iterations!.find(_iteration => _iteration.n === (iteration.n * 2) && _iteration.is_lower_bracket === iteration.is_lower_bracket)!;

      if (!prev) return iteration;
  
      const battles: BattleEntity[] = new Array(iteration.battles.length);
  
      iteration.battles.forEach(battle => {
        const index = Math.floor(prev.battles!.findIndex(prevBattle =>
          prevBattle.slot1 === battle.slot1
          || prevBattle.slot2 === battle.slot2
          || prevBattle.slot2 === battle.slot1
          || prevBattle.slot1 === battle.slot2) / 2);

        battles[index] = battle;
      });
  
      return { ...iteration, battles };
    });
  
    return tournament;
  }  
}

interface Options {
  teams?: boolean;
  owner?: boolean;
  iterations?: boolean;
  actual?: boolean;
}