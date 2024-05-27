
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import { IsLowercase, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { FileFilterCallback } from 'multer';
import * as sharp from 'sharp';
import { TeamStandart } from './team.standart';

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
export class UnallowedFileFormat extends HttpException {
  constructor() {super('unallowed_file_format', HttpStatus.NOT_ACCEPTABLE)};
}
export class UnallowedFileSize extends HttpException {
  constructor() {super('unallowed_file_size', HttpStatus.NOT_ACCEPTABLE)};
}
export class UnallowedFileMetadata extends HttpException {
  constructor() {super('limit_metadata', HttpStatus.NOT_ACCEPTABLE)};
}



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
