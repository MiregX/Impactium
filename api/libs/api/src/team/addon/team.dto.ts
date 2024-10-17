import { IsEnum, IsInt, IsLowercase, IsNotEmpty, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';
import { TeamMemberEntity } from './team.member.entity';
import { Joinable, Role } from '@prisma/client';
import { λError, Identifier, DisplayName } from '@impactium/pattern';
import { TeamEntity } from './team.entity';
import { TeamInviteEntity } from './teamInvite.entity';

export class CreateTeamDto {
  @IsNotEmpty()
  @Matches(Identifier.Indent, {
    message: λError.indent_invalid_format
  })
  indent!: TeamEntity['indent'];

  @IsNotEmpty()
  @Matches(DisplayName.base, {
    message: λError.username_invalid_format
  })
  title!: TeamEntity['title'];

  @IsEnum(Joinable, {
    message: λError.joinable_invalid_field
  })
  joinable!: Joinable;
}

export class UpdateTeamDto implements Partial<CreateTeamDto> {
  @IsOptional()
  @IsNotEmpty()
  @Matches(Identifier.Indent, {
    message: λError.indent_invalid_format
  })
  indent?: TeamEntity['indent'];

  @IsOptional()
  @IsNotEmpty()
  @Matches(DisplayName.base, {
    message: λError.username_invalid_format
  })
  title?: TeamEntity['title'];

  @IsEnum(Joinable, {
    message: λError.joinable_invalid_field
  })
  joinable?: Joinable;

  logo?: TeamEntity['logo'];
}

export class FindOneTeamByIndentDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  nickname!: string;
}

export class FindManyTeamsByIndentDto {
  @IsNotEmpty({each: true })
  @IsString({ each: true })
  @MinLength(3, {each: true })
  @MaxLength(32, {each: true })
  nicknames!: string[];
}

export type FindTeamDto = FindOneTeamByIndentDto | FindManyTeamsByIndentDto

export class UpdateTeamMemberRoleDto {
  @IsNotEmpty()
  @IsString()
  uid!: TeamMemberEntity['uid'];

  @IsOptional()
  @IsEnum(Role, {
    message: 'invalid_role'
  })
  role!: Role | null
}

export class CreateInviteDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(10)
  maxUses?: TeamInviteEntity['maxUses'];
}
