import { PartialType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreatePlayerDto implements Prisma.PlayerCreateInput {
  id?: string;
  nickname?: string;
  password?: string;
  register?: string | Date;
  skin?: Prisma.SkinCreateNestedOneWithoutPlayerInput;
  user: Prisma.UserCreateNestedOneWithoutPlayerInput;
  oldNicknames?: Prisma.OldNicknamesCreateNestedManyWithoutPlayerInput;
}
export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {}

