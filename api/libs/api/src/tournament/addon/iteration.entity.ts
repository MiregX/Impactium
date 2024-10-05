import { λIteration } from "@impactium/pattern";
import { $Enums, Iteration, Prisma } from "@prisma/client";
import { BattleEntity } from "./battle.entity";

export class IterationEntity implements Iteration {
  id!: string;
  tid!: string;
  n!: λIteration;
  is_lower_bracket!: boolean;

  public static select = ({ battles = true }: Options = {}): Prisma.IterationDefaultArgs => ({
    select: {
      id: true,
      tid: true,
      n: true,
      is_lower_bracket: true,
      battles: battles && BattleEntity.select()
    }
  })
}

interface Options {
  battles?: boolean
}