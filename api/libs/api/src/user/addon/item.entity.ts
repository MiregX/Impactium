import { Item, Prisma } from "@prisma/client";

export class ItemEntity implements Item {
  imprint!: string;
  amount!: number;
  uid!: string;
  id!: string;

  select = (): Prisma.ItemSelect => ({
    uid: true,
    id: true,
    imprint: true,
    amount: true
  })
}