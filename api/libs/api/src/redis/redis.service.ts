import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
  {
  constructor() {
    super(
      parseInt(process.env.MCS_REDIS_PORT),
      process.env.MCS_REDIS_HOST,
    )
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.quit();
  }
}
