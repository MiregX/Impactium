import { λIteration } from "@impactium/pattern";
import { $Enums, Iteration, Prisma } from "@prisma/client";
import { BattleEntity } from "./battle.entity";

export class IterationEntity implements Iteration {
  id!: string;
  tid!: string;
  n!: λIteration;
  best_of!: number;
  is_lower_bracket!: boolean;
  startsAt!: Date;

  public static select = ({ battles = true }: Options = {}): Prisma.IterationDefaultArgs => ({
    select: {
      id: true,
      tid: true,
      n: true,
      is_lower_bracket: true,
      best_of: true,
      startsAt: true,
      battles: battles && BattleEntity.select()
    },
    ...this.sort()
  })

  private static sort = () => ({
    orderBy: {
      n: Prisma.SortOrder.desc
    }
})
}


interface Options {
  battles?: boolean
}