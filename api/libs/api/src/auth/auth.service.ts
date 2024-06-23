import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import DiscordOauth2 = require('discord-oauth2');
import { UserService } from '@api/main/user/user.service';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { AuthPayload, AuthResult } from './addon/auth.entity';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { UUID } from 'crypto';
import { dataset } from '@api/main/redis/redis.dto';
import { LoginEntity } from '../user/addon/login.entity';

@Injectable()
export class AuthService {
  discordService: DiscordOauth2;

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async login(token: string): Promise<UserEntity> {
    if (!token) return null;
    const { email, uid } = this.userService.decodeJWT(token);

    if (uid) {
      return await this.userService.findById(uid);
    }
    else if (email) {
      return await this.userService.findByEmail(email);
    }
  }

  async register({ uid, id, type, avatar, displayName, email }: AuthPayload): Promise<AuthResult> {
    let login = await this.prisma.login.findUnique({
      where: { id, type },
    });
  
    try {
      const result = login
        ? await this.updateLogin({ id, type, avatar, displayName, uid }, login)
        : uid
          ? await this.prisma.login.create({
              data: {
                id,
                type,
                avatar,
                displayName,
                uid,
              }
            })
          : await this.prisma.user.upsert({
              where: { email },
              update: {
                email,
                logins: {
                  connectOrCreate: {
                    where: {
                      id,
                      type
                    },
                    create: {
                      id,
                      type,
                      avatar,
                      displayName,
                    },
                  }
                }
              },
              create: {
                email,
                uid: crypto.randomUUID(),
                logins: {
                  connectOrCreate: {
                    where: {
                      id,
                      type
                    },
                    create: {
                      id,
                      type,
                      avatar,
                      displayName
                    }
                  }
                }
              },
            })

      const JWT = this.userService.signJWT(result.uid, email)
      return this.parseToken(JWT)
    } catch (error) {
      console.log(error);
      const result = login
        ? await this.updateLogin({ id, type, avatar, displayName, uid }, login)
        : uid
          ? await this.createLogin({ id, type, avatar, displayName, uid, email, on: new Date() })
          : await this.prisma.user.create({
              data: {
                email,
                uid: crypto.randomUUID(),
                logins: {
                  connectOrCreate: {
                    where: {
                      id,
                      type
                    },
                    create: {
                      id,
                      type,
                      avatar,
                      displayName,
                    },
                  }
                }
              }
            })

      const JWT = this.userService.signJWT(result.uid, email)
      return this.parseToken(JWT)
    }
  }

  async getPayload(uuid: UUID): Promise<string | AuthPayload> {
    if (!uuid) return null;
    const payload = await this.redisService.get(this.getCacheFolder(uuid));
    await this.delPayload(uuid);
    try {
      return JSON.parse(payload) as AuthPayload;
    } catch (_) {
      return payload as string
    }
  }

  async setPayload(uuid: UUID, payload: AuthPayload | string) {
    await this.redisService.setex(this.getCacheFolder(uuid), 300, JSON.stringify(payload) || uuid);
  }

  async delPayload(uuid: UUID) {
    await this.redisService.del(this.getCacheFolder(uuid));
  }

  private getCacheFolder(uuid: UUID) {
    return `${dataset.connections}:${uuid}`
  }

  private parseToken(token: string): AuthResult {
    return (token.startsWith('Bearer ') ? token : `Bearer ${token}`) as AuthResult
  }

  private updateLogin({ id, type, avatar, displayName, uid }: AuthPayload, login: LoginEntity): Promise<LoginEntity> {
    return this.prisma.login.update({
      where: { id, type },
      data: { avatar, displayName, on: new Date(), uid: uid || login.uid },
    })
  }

  private createLogin(data: Required<AuthPayload>) {
    return this.prisma.login.create({ data });
  }
}
