import { HttpException, HttpStatus } from "@nestjs/common";

export class IndentNotProvided extends HttpException {
  constructor() {
    super('indent_not_provided', HttpStatus.CONFLICT);
  }
}

export class IndentInvalidFormat extends HttpException {
  constructor() {
    super('indent_invalid_format', HttpStatus.CONFLICT);
  }
}

export class UsernameNotProvided extends HttpException {
  constructor() {
    super('username_not_provided', HttpStatus.CONFLICT);
  }
}

export class UsernameInvalidFormat extends HttpException {
  constructor() {
    super('username_invalid_format', HttpStatus.CONFLICT);
  }
}
export class CodeNotProvided extends HttpException {
  constructor() {
    super('code_not_provided', HttpStatus.CONFLICT);
  }
}
export class CodeInvalidFormat extends HttpException {
  constructor() {
    super('code_invalid_format', HttpStatus.CONFLICT);
  }
}
export class UsernameTakenException extends HttpException {
  constructor() {
    super('username_taken_exception', HttpStatus.CONFLICT);
  }
}
export class UsernameIsSame extends HttpException {
  constructor() {
    super('username_is_same', HttpStatus.CONFLICT);
  }
}
export class DisplayNameIsSame extends HttpException {
  constructor() {
    super('displayName_is_same', HttpStatus.CONFLICT);
  }
}
export class DisplayNameInvalidFormat extends HttpException {
  constructor() {
    super('displayName_invalid_format', HttpStatus.CONFLICT);
  }
}
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
export class TeamMemberRoleExistException extends HttpException {
  constructor() {
    super('team_member_with_exact_role_already_exist', HttpStatus.CONFLICT)
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
export class EnvironmentKeyNotProvided extends Error {
  constructor(key: string) {
    super(`Ключ ${key} не был передан в .env файле. Проверь его ещё раз`);
  }
}
export class FTPUploadError extends HttpException {
  constructor() {
    super('ftp_upload_error', HttpStatus.GONE);
  }
}
