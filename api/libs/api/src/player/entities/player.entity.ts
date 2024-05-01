import { $Enums, Player } from "@prisma/client";

export class PlayerEntity implements Player {
  uid: string;
  steamId: string;
  nickname: string;
  role: $Enums.Roles;
  dotabuff: string;
}