import { FtpService } from './ftp.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [
    FtpService
  ],
  exports: [
    FtpService
  ]
})
export class SFTPModule {}
