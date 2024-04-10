import { Player, Skin } from "@prisma/client";
import { SkinEntity } from "./skin.entity";

export class ReducedPlayerEntity {
  constructor(player: PlayerEntity) {
    return {
      uid: player.uid,
      nickname: player.nickname,
      password: player.password,
      register: player.register,
      ski
    }
  }
}

export class PlayerEntity implements Player {
  uid: string;
  nickname: string;
  password: string;
  register: Date;
  skin: SkinEntity
  
  reduce() {
    return new Re
  }
}