import { Injectable, OnModuleInit } from '@nestjs/common';
import { Configuration } from '@impactium/config';
import { RedisService } from '@api/main/redis/redis.service';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { TelegramService } from '@api/mcs/telegram/telegram.service';
import { StatusEntity, StatusInfoEntityTypes } from './addon/status.entity';
import { dataset } from '../redis/redis.dto';

@Injectable()
export class ApplicationService implements OnModuleInit {
  constructor(
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService,
    private readonly telegramService: TelegramService,
  ) {}

  async info() {
    return await this.redisService.get(dataset.info)
      .then(data => data ? JSON.parse(data) : Promise.reject())
      .catch(async _ => {
        const [users_count, teams_count, tournaments_count] = await Promise.all([
          await this.prisma.user.count(),
          await this.prisma.team.count(),
          await this.prisma.tournament.count()
        ]);

        const info = {
          status: 200,
          environment: this.getEnvironment(),
          localhost: [process.env.API_SYMBOLIC_HOST, process.env.API_NUMERIC_HOST, process.env.API_PRODUCTION_HOST],
          statistics: {
            users_count,
            teams_count,
            tournaments_count,
          }
        }
    
        await this.redisService.setex(dataset.info, 600, JSON.stringify(info));

        return info;
      })
  }

  async status(): Promise<StatusEntity[]> {
    return await this.redisService.get(dataset.status)
      .then(data => data ? JSON.parse(data) : []);
  }

  async handle() {
    const existStatus = await this.status();

    const [redis, telegram, cockroachdb] = await Promise.all([
      this.getRedis(),
      this.getTelegram(),
      this.getPrisma()
    ]);

    await this.redisService.set(dataset.status, JSON.stringify([...existStatus.slice(-60), {
      redis,
      telegram,
      cockroachdb
    } as {
      [key: string]: StatusEntity
    }]));
  }

  private getEnvironment() {
    return {
      loaded: Configuration.isEnvironmentLoaded(),
      mode: Configuration.getMode(),
      message: process.env.X_MESSAGE,
    }
  }

  private async getRedis(): Promise<StatusEntity> {
    return {
      ping: await this.redisService._latency(),
      info: await this.redisService.info().then(response => {
          const lines = response.split('\r\n');
          const result = {} as any;
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

          const { redis_version, os } = result.server;

          return {
            type: StatusInfoEntityTypes.Memory,
            [StatusInfoEntityTypes.Memory]: {
              used: result.memory.used_memory_human,
              max: '32MB'
            },
            version: redis_version,
            os
          };
      })
    }
  }

  private async getTelegram(): Promise<StatusEntity> {
    return {
      ping: await this.telegramService._latency(),
      info: undefined,
    }
  }

  private async getPrisma(): Promise<StatusEntity> {
    const start = Date.now();
    await this.prisma.ping();
    return {
      ping: Date.now() - start,
      info: undefined
    };
  }
  
  async onModuleInit() {
    await this.prisma.user.upsert({
      where: {
        uid: 'system'
      },
      create: {
        uid: 'system',
        displayName: 'System',
        username: 'system',
        email: 'admin@impactium.fun',
        verified: true
      },
      update: {}
    });
  }
}
