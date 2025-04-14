import { SftpService } from './sftp.service';
import { FtpService } from './ftp.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [
    SftpService,
    FtpService
  ],
  exports: [
    SftpService,
    FtpService
  ]
})
export class FileModule {}
