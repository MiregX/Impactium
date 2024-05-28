import { HttpException, HttpStatus } from '@nestjs/common';
import { IsLowercase, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { FileFilterCallback } from 'multer';
import { TeamStandart } from './team.standart';

export class CreateTeamDto {
  @IsNotEmpty()
  title: string;

  banner?: any;
}

export class Checkout {
  uid: string;
  indent: string;
}

export class UpdateTeamDto implements Partial<CreateTeamDto> {
  title: any;
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

export class UploadFileDto {
  static getConfig() {
    return {
      fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.mimetype)) {
          return cb(null, false);
        }

        if (file.size > TeamStandart.LOGO_BYTE_SIZE) {
          return cb(null, false);
        }

        cb(null, true);
      },
      limits: {
        fileSize: TeamStandart.LOGO_BYTE_SIZE
      },
    };
  }
}
