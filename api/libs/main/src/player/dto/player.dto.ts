import { PartialType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreatePlayerDto implements Prisma.PlayerCreateInput {
  uid?: string;
  user: Prisma.UserCreateNestedOneWithoutPlayerInput;
  nickname?: string;
  password?: string;
  register?: string | Date;
  skin?: Prisma.SkinCreateNestedOneWithoutPlayerInput;
  oldNicknames?: Prisma.OldNicknamesCreateNestedManyWithoutPlayerInput;
}
export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {
  nickname?: string;
  password?: string;
  skin?: Prisma.SkinCreateNestedOneWithoutPlayerInput;
}

export class PlayerRequestDto {
  nickname?: string
}

export class FindOnePlayerByNicknameDto {
  nickname: string
}

export class FindManyPlayersByNicknamesDto {
  nickname: string[]
}

export type FindPlayers = FindOnePlayerByNicknameDto | FindManyPlayersByNicknamesDto