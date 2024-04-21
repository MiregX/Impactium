import { Player, Skin } from "@prisma/client";
import { ReducedSkinEntity, SkinEntity } from "./skin.entity";

export class ReducedPlayerEntity {
  selectFields() {
    return {
      nickname: true,
      password: true,
      register: true,
      skin: {
        select: {
          title: true,
          icon: true,
          source: true
        }
      }
    };
  }
}

export class PlayerEntity implements Player {
  uid: string;
  nickname: string;
  password: string;
  register: Date;
  skin: SkinEntity
}