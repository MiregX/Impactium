import { ForbiddenException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserService } from '@api/main/user/user.service';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { AuthPayload, Token, Payload, RequiredAuthPayload } from './addon/auth.entity';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { UUID } from 'crypto';
import { dataset } from '@api/main/redis/redis.dto';
import { LoginEntity } from '../user/addon/login.entity';
import { JwtService } from '@nestjs/jwt';
import { Optional, λLogger, λParam } from '@impactium/pattern';
import { λthrow } from '@impactium/utils';
import { Logger } from '../application/addon/logger.service';
import { UserNotFound } from '../application/addon/error';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly jwt: JwtService,
  ) {}

  login = (token: Token): Payload => this.decodeJWT(token);

  async register({ uid, id, type, avatar, displayName, email }: AuthPayload): Promise<Token> {
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
    return this.signJWT({ uid: result.uid as λParam.Id });
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

  signJWT = (payload: Payload): Token => `Bearer ${this.jwt.sign(payload, { secret: process.env.JWT_SECRET, expiresIn: '7d' })}`;

  decodeJWT = (token: Token): Payload => this.jwt.decode(token.startsWith('Bearer ') ? token.substring(7) : token) || λthrow(ForbiddenException);
  
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
    }) as unknown as Promise<UserEntity>;
  }

  public impersonate = async (uid: λParam.Id) => {
    const user = await this.prisma.user.findUnique({
      where: { uid },
      select: {
        email: true,
        username: true,
      }
    });

    if (!user) {
      Logger.warn(`Administrator tried impersonat user: ${λLogger.blue(uid)}`, 'λ');
      λthrow(UserNotFound)
    };

    Logger.warn(`Administrator impersonated user: ${λLogger.blue(user.username)}`, 'λ');

    return `Bearer ${this.signJWT({ uid })}`;
  }
}
