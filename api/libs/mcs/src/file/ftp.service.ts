import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client, AccessOptions } from 'basic-ftp';
import { createReadStream } from 'fs';
import { Readable } from 'stream';

@Injectable()
export class FtpService extends Client implements OnModuleInit, OnModuleDestroy {
  private readonly options: AccessOptions = JSON.parse(process.env.FTP);

  constructor() {
    super();
  }

  async onModuleInit() {
    try {
      await this.access(this.options);
    } catch (error) {
      console.error('Error initializing FTP client:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      this.close();
    } catch (error) {
      console.error('Error closing FTP client:', error);
      throw error;
    }
  }

  async uploadFile(path: string, stream: Readable) {
    const combinedPath = 'cdn.impactium.fun/htdocs/' + path;
    try {
      await this.uploadFrom(stream, combinedPath);
    } catch (error) {
      await this.access(this.options);
      this.uploadFile(path, stream);
    }
  }
}
