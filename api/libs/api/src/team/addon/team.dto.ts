import { HttpException, HttpStatus } from '@nestjs/common';
import { $Enums, Prisma } from '@prisma/client';
import { IsLowercase, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @MinLength(5)
  @MaxLength(32)
  @IsNotEmpty()
  title: string;

  banner?: any;
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
  constructor() {super('already_exists', HttpStatus.CONFLICT)};
}

export class TeamLimitException extends HttpException {
  constructor() {super('limit_exception', HttpStatus.CONFLICT)};
}

export enum TeamStandarts {
  DEFAULT_PAGINATION_LIMIT = 20,
  DEFAULT_PAGINATION_PAGE = 0,
} 
