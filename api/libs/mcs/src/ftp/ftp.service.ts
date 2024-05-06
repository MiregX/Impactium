import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client, AccessOptions, FTPResponse } from 'basic-ftp';

@Injectable()
export class FtpService extends Client implements OnModuleInit, OnModuleDestroy {
  private readonly options: AccessOptions;

  constructor() {
    super(0);
    this.options = {
      host: 'ftpupload.net'
    }
  }
  async onModuleInit() {
    await this.access(this.options);
  }
  onModuleDestroy() {
    this.ftp.close();
  }
}
