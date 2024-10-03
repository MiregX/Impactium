import { TeamEntity } from "@api/main/team/addon/team.entity";
import { Battle, Prisma } from "@prisma/client";
import { IterationEntity } from "./iteration.entity";

export class BattleEntity<T = {}> implements Battle {
  id!: string;
  iid!: string;
  winner!: string | null;
  slot1!: string;
  slot2!: string | null;
  createdAt!: Date;
  iteration?: IterationEntity;

  static select = ({ iteration = false }: Options = {}) => ({
    id: true,
    winner: true,
    slot1: true,
    slot2: true,
    createdAt: true,
    iid: true,
    iteration: iteration && {
      select: IterationEntity.select({ battles: false })
    }
  })
}

interface Options {
  iteration?: boolean
}
