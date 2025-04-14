import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Telegraf, Markup } from 'telegraf';

@Injectable()
export class SftpService
implements OnModuleInit, OnModuleDestroy {
  constructor() {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.close();
  }

  private async connect() {
    
  }

  private async close() {
    
  }
}
