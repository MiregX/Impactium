import { SFTPService } from './sftp.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [
    SFTPService
  ],
  exports: [
    SFTPService
  ]
})
export class SFTPModule {}
