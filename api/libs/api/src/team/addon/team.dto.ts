import { HttpException, HttpStatus } from '@nestjs/common';
import { IsEnum, IsInt, IsLowercase, IsNotEmpty, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';
import { FileFilterCallback } from 'multer';
import { TeamStandart } from './team.standart';
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
    message: λError.invalid_joinable_field
  })
  joinable!: Joinable;


  logo?: TeamEntity['logo'];
}

export class TeamCheckout {
  uid!: string;
  indent!: string;
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
    message: λError.invalid_joinable_field
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

export class UploadFileDto {
  static getConfig() {
    return {
      fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        // Проверяем тип mime
        if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.mimetype)) {
          return cb(new Error('Unsupported file type') as unknown as null, false);
        }

        // Проверяем размер файла
        if (file.size > TeamStandart.LOGO_BYTE_SIZE) {
          return cb(new Error('File too large') as unknown as null, false);
        }

        // Если все ок
        cb(null, true);
      },
      limits: {
        fileSize: TeamStandart.LOGO_BYTE_SIZE, // Лимит на размер файла
      },
    };
  }
}

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
