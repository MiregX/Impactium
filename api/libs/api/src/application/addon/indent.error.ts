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
