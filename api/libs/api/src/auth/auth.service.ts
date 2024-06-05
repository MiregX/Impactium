import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import DiscordOauth2 = require('discord-oauth2');
import { UserService } from '@api/main/user/user.service';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { AuthPayload, AuthResult } from './addon/auth.entity';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { TelegramService } from '@api/mcs/telegram/telegram.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  discordService: DiscordOauth2;

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}

  async login(token: string): Promise<UserEntity> {
    const { email, uid } = this.userService.decodeJWT(token);
    console.log({email, uid})

    if (uid) {
      return await this.userService.findOneById(uid);
    }
    else if (email) {
      return await this.userService.findOneByEmail(email);
    }
    else {
      throw new NotFoundException();
    }
  }

  async register({ id, type, avatar, displayName, email }: AuthPayload): Promise<AuthResult> {
    let login = await this.prisma.login.findUnique({
      where: { id, type },
    });
  
    if (login) {
      login = await this.prisma.login.update({
        where: { id, type },
        data: { avatar, displayName, on: new Date() },
      });
    } else {
      // TODO
      // Fix email inplementation (4)
      const { uid } = email
        ? await this.prisma.user.upsert({
            where: { email },
            update: { email },
            create: { email: email ? email : '' },
          })
        : await this.prisma.user.create({ data: { email } });
  
      login = await this.prisma.login.create({
        data: {
          id,
          type,
          avatar,
          displayName,
          uid,
        },
      });
    }
    
    const JWT = this.userService.signJWT(login.uid, email)
    return this.parseToken(JWT)
  }

  private parseToken (token: string): AuthResult {
    return (token.startsWith('Bearer ') ? token : `Bearer ${token}`) as AuthResult
  }
}
