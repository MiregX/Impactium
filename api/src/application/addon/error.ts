import { λError } from "@impactium/types";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Logger } from "./logger.service";

export class Exception extends HttpException {
  constructor(error: keyof typeof λError, status: HttpStatus) {
    Logger.error(error, status.toString());
    super(error, status);
  }
}
export class IndentNotProvided extends Exception {
  constructor() {
    super(λError.indent_not_provided, HttpStatus.CONFLICT);
  }
}
export class IndentInvalidFormat extends Exception {
  constructor() {
    super(λError.indent_invalid_format, HttpStatus.CONFLICT);
  }
}
export class IndentTaken extends Exception {
  constructor() {
    super(λError.indent_taken, HttpStatus.CONFLICT);
  }
}
export class UsernameNotProvided extends Exception {
  constructor() {
    super(λError.username_not_provided, HttpStatus.CONFLICT);
  }
}
export class UsernameInvalidFormat extends Exception {
  constructor() {
    super(λError.username_invalid_format, HttpStatus.CONFLICT);
  }
}
export class UsernameTaken extends Exception {
  constructor() {
    super(λError.username_taken, HttpStatus.CONFLICT);
  }
}
export class UserNotFound extends HttpException {
  constructor() {
    super(λError.user_not_found, HttpStatus.NOT_FOUND);
  }
}
export class CodeNotProvided extends Exception {
  constructor() {
    super(λError.code_not_provided, HttpStatus.CONFLICT);
  }
}
export class CodeInvalidFormat extends Exception {
  constructor() {
    super(λError.code_invalid_format, HttpStatus.CONFLICT);
  }
}
export class CodeTaken extends Exception {
  constructor() {
    super(λError.code_taken, HttpStatus.CONFLICT);
  }
}
export class UsernameIsSame extends Exception {
  constructor() {
    super(λError.username_is_same, HttpStatus.CONFLICT);
  }
}
export class DisplayNameIsSame extends Exception {
  constructor() {
    super(λError.display_name_is_same, HttpStatus.CONFLICT);
  }
}
export class DisplayNameInvalidFormat extends Exception {
  constructor() {
    super(λError.display_name_invalid_format, HttpStatus.CONFLICT);
  }
}
export class TeamAlreadyExist extends Exception {
  constructor() {
    super(λError.team_already_exists, HttpStatus.CONFLICT)
  };
}
export class TournamentAlreadyExist extends Exception {
  constructor() {
    super(λError.tournament_already_exists, HttpStatus.CONFLICT)
  };
}
export class TeamLimit extends Exception {
  constructor() {
    super(λError.team_limit, HttpStatus.CONFLICT)
  };
}
export class TournamentLimit extends Exception {
  constructor() {
    super(λError.tournament_limit, HttpStatus.CONFLICT)
  };
}
export class TeamMemberRoleExistException extends Exception {
  constructor() {
    super(λError.team_member_with_exact_role_already_exist, HttpStatus.CONFLICT)
  };
}
export class TooManyQRCodes extends Exception {
  constructor() {
    super(λError.too_many_qrcodes, HttpStatus.TOO_MANY_REQUESTS)
  };
}
export class TeamIsFreeToJoin extends Exception {
  constructor() {
    super(λError.team_is_free_to_join, HttpStatus.CONFLICT)
  };
}
export class UserIsAlreadyTeamMember extends Exception {
  constructor() {
    super(λError.user_is_already_team_member, HttpStatus.CONFLICT)
  };
}
export class TeamIsCloseToEveryone extends Exception {
  constructor() {
    super(λError.team_is_close_to_everyone, HttpStatus.CONFLICT)
  };
}
export class TeamInviteNotFound extends Exception {
  constructor() {
    super(λError.team_invite_not_found, HttpStatus.CONFLICT)
  };
}
export class TeamInviteUsed extends Exception {
  constructor() {
    super(λError.team_invite_used, HttpStatus.CONFLICT)
  };
}
export class TeamInviteExpired extends Exception {
  constructor() {
    super(λError.team_invite_expired, HttpStatus.CONFLICT)
  };
}
export class UnallowedFileFormat extends Exception {
  constructor() {
    super(λError.unallowed_file_format, HttpStatus.NOT_ACCEPTABLE)
  };
}
export class UnallowedFileSize extends Exception {
  constructor() {
    super(λError.unallowed_file_size, HttpStatus.NOT_ACCEPTABLE)
  };
}
export class UnallowedFileMetadata extends Exception {
  constructor() {
    super(λError.unallowed_file_metadata, HttpStatus.NOT_ACCEPTABLE)
  };
}
export class MultipleFilesError extends Exception {
  constructor() {
    super(λError.multiple_files_error, HttpStatus.CONFLICT)
  };
}
export class EnvironmentKeyNotProvided extends Error {
<<<<<<< Updated upstream:api/libs/api/src/application/addon/error.ts
  constructor(key?: string) {
    super(`Ключ ${key} не был передан в .env файле. Проверь его ещё раз`);
  }

  static new = (key: string) => new EnvironmentKeyNotProvided(key) as unknown as new () => EnvironmentKeyNotProvided;
=======
  constructor(key: string = 'отсутствует и') {
    super(`Ключ ${key} не был передан в .env файле. Проверь его ещё раз`);
  }

  static new = (key: string): new () => EnvironmentKeyNotProvided => new EnvironmentKeyNotProvided(key) as unknown as new () => EnvironmentKeyNotProvided;
>>>>>>> Stashed changes:api/src/application/addon/error.ts
}
export class FTPUploadError extends Exception {
  constructor() {
    super(λError.ftp_upload_error, HttpStatus.GONE);
  }
}
