import { λCache } from '@impactium/pattern';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Callback, Redis } from 'ioredis';

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

  async _latency() {
    const start = process.hrtime.bigint();
    await this.ping();
    const end = process.hrtime.bigint();

    return parseInt((Number(end - start) / 1e6).toFixed(0));
  }

  fget = async (folder: λCache, key: string, callback?: Callback<string | null>) => this.parse(await this.get(RedisService.compare(folder, key)));

  fset = async <T>(folder: λCache, key: string, value: T): Promise<T> => await this.set(RedisService.compare(folder, key), this.normalize(value)) && value;

  fsetex = async <T>(folder: λCache, key: string, value: T, seconds: number): Promise<T> => await this.setex(RedisService.compare(folder, key), seconds, this.normalize(value)) && value;

  fsetux = async <T>(folder: λCache, key: string, value: T, seconds?: number): Promise<T> => seconds ? this.fsetex(folder, key, value, seconds) : this.fset(folder, key, value);


  static compare = (...args: string[]) => args.join(':');

  private normalize = <T>(value: T): string => JSON.stringify(value);

  private parse = <T = unknown>(value?: any): T | null => value ? JSON.parse(value) : null;
}
