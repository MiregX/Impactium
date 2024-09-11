import { Inject, Injectable, OnModuleInit, forwardRef } from '@nestjs/common';
import DiscordOauth2 = require('discord-oauth2');
import { UserService } from '@api/main/user/user.service';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { AuthPayload, AuthResult, RequiredAuthPayload } from './addon/auth.entity';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { UUID } from 'crypto';
import { dataset } from '@api/main/redis/redis.dto';
import { LoginEntity } from '../user/addon/login.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async login(token: string): Promise<UserEntity | undefined> {
    if (!token) return undefined;
    
    const { email, uid } = this.userService.decodeJWT(this.unparseToken(token));

    if (uid) {
      return await this.userService.findById(uid) as UserEntity;
    }
    else if (email) {
      return await this.userService.findByEmail(email) as UserEntity;
    }
  }

  async register({ uid, id, type, avatar, displayName, email }: AuthPayload): Promise<AuthResult> {
    const login = await this.prisma.login.findUnique({
      where: { id, type },
    })
    const result = (login
      ? await this.updateLogin({ id, type, avatar, displayName, uid }, login)
      : (uid
        ? await this.createLogin({ id, type, avatar, displayName, uid, on: new Date() })
        : await this.createUser({ id, type, avatar, displayName, on: new Date() }, email)
      )
    )
    return this.parseToken(this.userService.signJWT(result.uid, email));
  }
      
  async getPayload<T extends string | AuthPayload = AuthPayload>(uuid?: UUID): Promise<T | null> {
    if (!uuid) return null;

    const payload = await this.redisService.get(this.getCacheFolder(uuid));
    await this.delPayload(uuid);
    try {
      return JSON.parse(payload!) as T;
    } catch (_) {
      return payload as T
    }
  }

  async setPayload(uuid: UUID, payload: AuthPayload | string) {
    await this.redisService.setex(this.getCacheFolder(uuid), 300, JSON.stringify(payload) || uuid);
  }
  
  async delPayload(uuid: UUID) {
    await this.redisService.del(this.getCacheFolder(uuid));
  }
  
  parseToken = (token: string): AuthResult => token.startsWith('Bearer ') ? token as AuthResult : `Bearer ${token}`

  unparseToken = (token: string): string => token.startsWith('Bearer ') ? token.substring(7) : token
  
  private getCacheFolder(uuid: UUID) {
    return `${dataset.connections}:${uuid}`
  }

  private updateLogin({ id, type, avatar, displayName, uid }: AuthPayload, login: LoginEntity): Promise<LoginEntity> {
    return this.prisma.login.update({
      where: { id, type },
      data: { avatar, displayName, on: new Date(), uid: uid || login.uid },
    })
  }

  private createLogin(data: Omit<AuthPayload, 'email'> & RequiredAuthPayload<'uid'>): Promise<LoginEntity> {
    return this.prisma.login.create({ data });
  }

  private createUser(data: AuthPayload, email?: AuthPayload['email']): Promise<UserEntity> {
    delete data.email;
    return this.prisma.user.create({
      data: {
        email,
        uid: crypto.randomUUID(),
        logins: {
          connectOrCreate: {
            where: {
              id: data.id,
              type: data.type
            },
            create: data,
          }
        }
      }
    })
  }
}
