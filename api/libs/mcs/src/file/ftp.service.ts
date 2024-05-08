import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client, AccessOptions, FTPResponse } from 'basic-ftp';

@Injectable()
export class FtpService extends Client implements OnModuleInit, OnModuleDestroy {
  private readonly options: AccessOptions = JSON.parse(process.env.FTP);

  constructor() {
    super(0);
  }
  async onModuleInit() {
    this.options.password && await this.access(this.options);
  }
  onModuleDestroy() {
    this.ftp.close();
  }
}
