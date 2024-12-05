import { TeamEntity } from "@api/main/team/addon/team.entity";
import { UserEntity } from "@api/main/user/addon/user.entity";
import { Iteration, Prisma, Role, Tournament } from "@prisma/client";
import { IterationEntity } from "./iteration.entity";
import { BattleEntity } from "./battle.entity";
import { PowerOfTwo, λIteration, λParam } from "@impactium/pattern";
import { MaybeArray } from "@impactium/types";

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

  public static normalize = <T extends MaybeArray<Tournament> | null>(tournaments: T) => (Array.isArray(tournaments)
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

  public static new_iteration = (n: λIteration, battles: BattleEntity[]): [BattleEntity[], BattleEntity[]] => {
    const prev_n = PowerOfTwo.prev(n);

    const sorting: {
      winners: string[]
      losers: string[]
    } = {
      winners: [],
      losers: []
    };

    battles.forEach(battle => {
      if (typeof battle.is_slot_one_winner !== 'boolean') return;

      sorting.winners.push(battle.is_slot_one_winner ? battle.slot1 : battle.slot2!);
      sorting.losers.push(battle.is_slot_one_winner ? battle.slot2! : battle.slot1);
    });

    const upper_bracket: BattleEntity[] = [];

    sorting.winners.forEach((indent, i) => {
      if (i % 2 !== 0) return;

      upper_bracket.push({
        slot1: indent,
        slot2: sorting.winners[i++],
      } as unknown as BattleEntity)
    });

    const lower_bracket: BattleEntity[] = [];

    sorting.losers.forEach((indent, i) => {
      if (i % 2 !== 0) return;

      lower_bracket.push({
        slot1: indent,
        slot2: sorting.losers[i++],
      } as unknown as BattleEntity)
    });

    return [upper_bracket, lower_bracket]
  }
}

interface Options {
  teams?: boolean;
  owner?: boolean;
  iterations?: boolean;
  actual?: boolean;
}