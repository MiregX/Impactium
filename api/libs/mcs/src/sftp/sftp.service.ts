import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Telegraf, Markup } from 'telegraf';
import { Online } from '@api/mcs/console/console.dto';

@Injectable()
export class SFTPService
implements OnModuleInit, OnModuleDestroy {
  constructor() {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.close();
  }
  
  async read(path: string): Promise<any> {
    return
  }

  private async connect() {
    
  }

  private async close() {
    
  }
}
