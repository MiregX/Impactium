import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
  {
  constructor() {
    super(
      parseInt(process.env.API_REDIS_PORT),
      process.env.API_REDIS_HOST, {
        lazyConnect: true,
      }
    )
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.quit();
  }
}
