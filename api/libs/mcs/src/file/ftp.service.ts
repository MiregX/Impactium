import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client, AccessOptions } from 'basic-ftp';
import { Readable } from 'stream';

@Injectable()
export class FtpService extends Client implements OnModuleInit, OnModuleDestroy {
  private readonly options: AccessOptions = JSON.parse(process.env.FTP!);

  onModuleInit = () => {
    this.access(this.options).catch(_ => console.error('[Fail] FTP Connection'));
  }

  onModuleDestroy = () => this.close();

  async uploadFile(path: string, stream: Readable) {
    await this.uploadFrom(stream, 'cdn.impactium.fun/htdocs/' + path).catch(_ => this.reconnect(() => this.uploadFile(path, stream)));
  }

  private async reconnect(callback?: (...params: any[]) => Promise<void>) {
    await this.access(this.options)
      .then(async _ => callback && await callback())
      .catch(_ => console.error('[Fail] FTP Reconnection'));
  }
}
