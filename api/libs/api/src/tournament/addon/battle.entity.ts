import { TeamEntity } from "@api/main/team/addon/team.entity";
import { Battle, Grid, Prisma } from "@prisma/client";

export class BattleEntity<T = {}> implements Battle {
  id!: string;
  gid!: Grid['id'];
  iteration!: number;
  slot1!: TeamEntity['indent'] | null;
  slot2!: TeamEntity['indent'] | null;
  winner!: string | null;
  start!: Date | null;
  end!: Date | null;

  static select({ teams }: Options = {}): Prisma.BattleSelect {
    return {
      id: true,
      gid: true,
      iteration: true,
      slot1: true,
      slot2: true,
      winner: true,
      start: true,
      end: true
    };
  }
}

interface Options {
  teams?: boolean;
}