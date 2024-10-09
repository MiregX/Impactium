import { TeamEntity } from "@api/main/team/addon/team.entity";
import { Battle, Prisma } from "@prisma/client";
import { IterationEntity } from "./iteration.entity";

export class BattleEntity implements Battle {
  id!: string;
  iid!: string;
  slot1!: string;
  slot2!: string | null;
  is_slot_one_winner!: boolean | null;
  createdAt!: Date;
  iteration?: IterationEntity;

  public static select = ({ iteration = false }: Options = {}): Prisma.BattleDefaultArgs => ({
    select: {
      id: true,
      is_slot_one_winner: true,
      slot1: true,
      slot2: true,
      createdAt: true,
      iid: true,
      iteration: iteration && IterationEntity.select({ battles: false })
    }
  })
}

interface Options {
  iteration?: boolean
}
