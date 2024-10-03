import { λIteration } from "@impactium/pattern";
import { BattleFormat, Format } from "@prisma/client";

export class FormatEntity implements Format {
  id!: string;
  tid!: string;
  n!: λIteration;
  format!: BattleFormat;

  static select = () => ({
    id: true,
    tid: true,
    n: true,
    format: true
  })
}