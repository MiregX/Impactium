import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

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

export class FindManyPlayersByNicknamesDto {
  @IsNotEmpty()
  @IsString({ each: true })
  nicknames: string[];
}

export type FindPlayersDto = FindOnePlayerByNicknameDto | FindManyPlayersByNicknamesDto

export class FindOnePlayerByNicknameDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  nickname: string;
}

export type SetNicknameDto = FindOnePlayerByNicknameDto

export class SetPasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class PlayerAlreadyExists extends HttpException {
  constructor() {
    super('exists', HttpStatus.CONFLICT);
  }
}
export class PlayerHaveSameNickname extends HttpException {
  constructor() {
    super('in_use', HttpStatus.CONFLICT);
  }
}