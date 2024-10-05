import { λIteration } from "@impactium/pattern";
import { Format, Prisma } from "@prisma/client";

export class FormatEntity implements Format {
  id!: string;
  tid!: string;
  n!: λIteration;
  best_of!: number;

  public static select = () => ({
    select: {
      id: true,
      tid: true,
      n: true,
      best_of: true
    },
    ...this.sort()
  });

  private static sort = () => ({
    orderBy: {
      n: Prisma.SortOrder.desc
    }
  })
}