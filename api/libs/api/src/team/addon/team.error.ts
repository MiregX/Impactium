import { HttpException, HttpStatus } from "@nestjs/common"

export class TeamAlreadyExist extends HttpException {
  constructor() {
    super('team_already_exists', HttpStatus.CONFLICT)
  };
}
export class TeamLimitException extends HttpException {
  constructor() {
    super('team_limit_exception', HttpStatus.CONFLICT)
  };
}
export class UnallowedFileFormat extends HttpException {
  constructor() {
    super('unallowed_file_format', HttpStatus.NOT_ACCEPTABLE)
  };
}
export class UnallowedFileSize extends HttpException {
  constructor() {
    super('unallowed_file_size', HttpStatus.NOT_ACCEPTABLE)
  };
}
export class UnallowedFileMetadata extends HttpException {
  constructor() {
    super('unallowed_file_metadata', HttpStatus.NOT_ACCEPTABLE)
  };
}