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

  async status() {
    return {
      redis: await this.getRedis(),
      telegram: await this.getTelegram(),
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
    return {
      ping: await this.redisService.ping(),
      info: await this.redisService.info().then(response => {
          const lines = response.split('\r\n');
          const result = {};
          let section = null;
        
          lines.forEach(line => {
            if (line.startsWith('#')) {
              section = line.slice(2).toLowerCase();
              result[section] = {};
            } else if (line) {
              const [key, value] = line.split(':');
              if (section) {
                result[section][key] = value;
              } else {
                result[key] = value;
              }
            }
          });

          return result;
      })
    }
  }

  private async getTelegram() {
  }
}
