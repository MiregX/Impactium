import { HttpException, HttpStatus } from "@nestjs/common";

export class FTPUploadError extends HttpException {
  constructor() {
    super('ftp_upload_error', HttpStatus.UNSUPPORTED_MEDIA_TYPE);
  }
}