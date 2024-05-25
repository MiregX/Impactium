import { Injectable } from '@nestjs/common';
import { Configuration } from '@impactium/config';
import { RedisService } from '../redis/redis.service';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '@api/mcs/telegram/telegram.service';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly redisService: RedisService,
    private readonly prismaService: PrismaService,
    private readonly telegramService: TelegramService,
  ) {}

  info() {
    return {
      status: 200,
      environment: this.getEnvironment(),
      enforced_preloader: !!process.env.ENFORCED_PRELOADER,
      localhost: process.env.API_LOCALHOST
    }
  }

  status() {
    return {
      redis: redis
    }
  }

  private getEnvironment() {
    return {
      loaded: Configuration.isEnvironmentLoaded(),
      path: process.env.X_PATH,
      mode: Configuration.getMode(),
      message: process.env.X_MESSAGE,
    }
  }

  private async getRedis() {
    return await this.redisService.
  }
}
