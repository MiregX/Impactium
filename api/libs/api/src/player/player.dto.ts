import { $Enums, Prisma } from '@prisma/client';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePlayerDto implements Prisma.PlayerCreateInput {
  nickname: string;
  role: $Enums.Roles;
  dotabuff?: string;
  steamId?: string;
  user: Prisma.UserCreateNestedOneWithoutPlayerInput;
}

export class FindOnePlayerByNicknameDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  nickname: string;
}

export class FindManePlayerByNicknamesDto {
  @IsNotEmpty({each: true })
  @IsString({ each: true })
  @MinLength(3, {each: true })
  @MaxLength(32, {each: true })
  nicknames: string[];
}

export type FindPlayersDto = FindOnePlayerByNicknameDto | FindManePlayerByNicknamesDto