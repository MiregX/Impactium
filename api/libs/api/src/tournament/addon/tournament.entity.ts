import { TeamEntity } from "@api/main/team/addon/team.entity";
import { UserEntity } from "@api/main/user/addon/user.entity";
import { Iteration, Prisma, Role, Tournament } from "@prisma/client";
import { IterationEntity } from "./iteration.entity";
import { BattleEntity } from "./battle.entity";

export class TournamentEntity implements Tournament {
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

  public static normalize = (tournament: TournamentEntity | null) => {
    if (!tournament || !tournament.iterations) return null;
  
    tournament.iterations = tournament.iterations.map((iteration, i) => {
      if (!i || !iteration.battles) return iteration; // Пропускаем первую итерацию

      const prev = tournament.iterations!.find(_iteration => _iteration.n === (iteration.n * 2) && _iteration.is_lower_bracket === iteration.is_lower_bracket)!;

      if (!prev) return iteration;
  
      const battles: BattleEntity[] = new Array(iteration.battles.length);
  
      iteration.battles.forEach(battle => {
        const index = Math.floor(prev.battles!.findIndex(prevBattle =>
          prevBattle.slot1 === battle.slot1
          || prevBattle.slot2 === battle.slot2
          || prevBattle.slot2 === battle.slot1
          || prevBattle.slot1 === battle.slot2) / 2);

        if (battles[index]) {
          console.log(index);
          console.log(battle);
          console.log(battles)
        }

        battles[index] = battle;
      });
  
      return { ...iteration, battles }; // Возвращаем новую итерацию с отсортированными битвами
    });
  
    return tournament; // Возвращаем нормализованный турнир
  }  
}

interface Options {
  teams?: boolean;
  owner?: boolean;
  iterations?: boolean;
  actual?: boolean;
}