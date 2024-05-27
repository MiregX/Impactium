import { Injectable } from '@nestjs/common';
import { Configuration } from '@impactium/config';
import { RedisService } from '@api/main/redis/redis.service';
import { PrismaService } from '@api/main/prisma/prisma.service';
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
    return await this.redisService.get('status')
      .then(data => JSON.parse(data))
      .catch(async _ => {
        const [redis, telegram, cockroachdb] = await Promise.all([
          this.getRedis(),
          this.getTelegram(),
          this.getPrisma()
        ]);
    
        const status = {
          redis,
          telegram,
          cockroachdb
        };
    
        return await this.redisService.setex('status', 60, JSON.stringify(status)).then(_ => status);
      })
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
      ping: await this.redisService._latency(),
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

  private async getPrisma() {
    const start = Date.now();
    await this.prismaService.ping();
    return {
      ping: Date.now() - start,
      info: undefined
    };
  }
}
