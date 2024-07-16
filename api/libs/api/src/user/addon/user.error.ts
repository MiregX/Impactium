import { HttpException, HttpStatus } from "@nestjs/common";

export class UsernameTakenException extends HttpException {
  constructor() {
    super('username_taken_exception', HttpStatus.CONFLICT);
  }
}

export class UsernameInvalidException extends HttpException {
  constructor() {
    super('username_invalid_format', HttpStatus.CONFLICT);
  }
}