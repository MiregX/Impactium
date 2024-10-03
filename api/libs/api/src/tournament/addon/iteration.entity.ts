import { λIteration } from "@impactium/pattern";
import { $Enums, Iteration } from "@prisma/client";
import { BattleEntity } from "./battle.entity";

export class IterationEntity implements Iteration {
  id!: string;
  tid!: string;
  n!: λIteration;
  bracketType!: $Enums.BracketType;

  static select = ({ battles = true }: Options = {}) => ({
    id: true,
    tid: true,
    n: true,
    bracketType: true,
    battles: battles && {
      select: BattleEntity.select()
    }
  })
}

interface Options {
  battles?: boolean
}