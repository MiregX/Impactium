import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Configuration } from '@impactium/config';
import { RedisService } from '@api/main/redis/redis.service';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { StatusEntity, StatusInfoEntityTypes } from './addon/status.entity';
import { dataset } from '../redis/redis.dto';
import { UserService } from '@api/main/user/user.service';
import { AuthService } from '@api/main/auth/auth.service';
import { SocketGateway } from '../socket/socket.gateway';
import { Token } from '../auth/addon/auth.entity';
import { Blueprint } from '@prisma/client';
import { HOUR, λParam, λWebSocket } from '@impactium/pattern';
import { Logger } from './addon/logger.service';
import { UserEntity } from '../user/addon/user.entity';

@Injectable()
export class ApplicationService implements OnModuleInit {
  blueprints: Blueprint[] = [];
  constructor(
    @Inject(forwardRef(() => SocketGateway))
    private readonly webSocket: SocketGateway,
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async info(username?: UserEntity['username']): Promise<any> {
    const info = await this._getInfo()
      .catch(async _ => {
        return await this._reloadInfo();
      })

    if (username === 'system') info.history = Logger.history();

    return info;
  }

  async toggleSafeMode() {
    const toggled = await this._getIsSafeMode() ? 0 : 1;
    await this.redisService.set(dataset.isSafeMode, toggled);

    return await this.sync(await this._reloadInfo());
  }

  async setGlobalPhrase(phrase?: string) {
    if (phrase) {
      await this.redisService.set(dataset.phrase, phrase);
    } else {
      await this.redisService.del(dataset.phrase);
    }

    return await this.sync(await this._reloadInfo());
  }


  private _getInfo = () => this.redisService.get(dataset.info).then(data => data ? JSON.parse(data) : Promise.reject());

  private async _reloadInfo(data?: any) {
    const info = data || await this._generateInfo()
    await this.redisService.setex(dataset.info, 600, JSON.stringify(info));
    return info;
  } 

  private async _generateInfo(): Promise<any> {
    const [users_count, teams_count, tournaments_count, isSafeMode, globalPhrase] = await Promise.all([
      await this.prisma.user.count(),
      await this.prisma.team.count(),
      await this.prisma.tournament.count(),
      await this.redisService.get(dataset.isSafeMode),
      await this.redisService.get(dataset.phrase)
    ]);

    return {
      status: 200,
      environment: this.getEnvironment(),
      localhost: [process.env.API_SYMBOLIC_HOST, process.env.API_NUMERIC_HOST, process.env.API_PRODUCTION_HOST],
      statistics: {
        users_count,
        teams_count,
        tournaments_count,
      },
      isSafeMode: parseInt(isSafeMode || '1'),
      history: [],
      globalPhrase
    } as any
  }

  async status(): Promise<StatusEntity[]> {
    return await this.redisService.get(dataset.status)
      .then(data => data ? JSON.parse(data) : []);
  }

  async sync(any: any) {
    this.webSocket.server.emit(λWebSocket.updateApplicationInfo, any);
    return any;
  }

  async getBlueprints(): Promise<Blueprint[]> {
    if (!this.blueprints.length) {
      this.blueprints = await this.prisma.blueprint.findMany();
      setTimeout(() => this.blueprints = [], HOUR);
    }
    return this.blueprints;
  }

  async handle() {
    const existStatus = await this.status();

    const [redis, cockroachdb] = await Promise.all([
      this.getRedis(),
      this.getPrisma()
    ]);

    await this.redisService.set(dataset.status, JSON.stringify([...existStatus.slice(-60), {
      redis,
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
          let section: null | string = null;
        
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

  private async getPrisma(): Promise<StatusEntity> {
    const start = Date.now();
    await this.prisma.ping();
    return {
      ping: Date.now() - start,
      info: undefined
    };
  }
  
  async onModuleInit() {
    await this.createSystemAccount();
  }

  async createSystemAccount(): Promise<Token> {
    const system = await this.prisma.user.upsert({
      where: {
        uid: 'system'
      },
      create: {
        uid: 'system',
        displayName: 'System',
        username: 'system',
        avatar: 'https://cdn.impactium.fun/logo/system_avatar.jpg',
        email: 'admin@impactium.fun',
        verified: true
      },
      update: {}
    });
    const token = this.authService.signJWT({ uid: system.uid as λParam.Id });
    Logger.verbose(token, 'λ');
    return token;
  }

  private async _getIsSafeMode(): Promise<0 | 1> {
    const string = await this.redisService.get(dataset.isSafeMode) || '0';
    return Math.min(1, Math.max(0, parseInt(string) || 0)) as 0 | 1;
  }
}
