import { HttpException, HttpStatus } from '@nestjs/common';
import { $Enums, Prisma } from '@prisma/client';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTeamDto {
  indent: string;
  banner: any;
  title: string;
}

export interface FindOneByIndent {
  throw: boolean;
}

export class TeamCheckoutDto {
  uid: string;
  indent: string;
}

export class UpdateTeamDto {
  banner: any;
  title: string;
}

export class FindOneTeamByIndentDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  nickname: string;
}

export class FindManyTeamsByIndentDto {
  @IsNotEmpty({each: true })
  @IsString({ each: true })
  @MinLength(3, {each: true })
  @MaxLength(32, {each: true })
  nicknames: string[];
}

export type FindTeamDto = FindOneTeamByIndentDto | FindManyTeamsByIndentDto

export class TeamAlreadyExist extends HttpException {
  constructor() {super('team already exists', HttpStatus.CONFLICT)};
}