import { Grid, Prisma } from "@prisma/client";
import { TournamentEntity } from "./tournament.entity";
import { BattleEntity } from "./battle.entity";

export class GridEntity<T = {}> implements Grid {
  id!: string;
  tid!: string;
  max!: number | null;
  battles!: BattleEntity[]
  tournament?: TournamentEntity

  static select({ teams }: Options = {}): Prisma.GridSelect {
    return {
      id: true,
      tid: true,
      max: true,
      battles: {
        select: BattleEntity.select({ teams })
      }
    };
  }
}

interface Options {
  teams?: boolean;
}