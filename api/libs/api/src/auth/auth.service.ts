import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import DiscordOauth2 = require('discord-oauth2');
import { UserService } from '@api/main/user/user.service';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { AuthPayload } from './addon/auth.entity';
import { Configuration } from '@impactium/config';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { $Enums } from '@prisma/client';
import { TelegramService } from '@api/mcs/telegram/telegram.service';
import { RedisService } from '../redis/redis.service';
import { dataset } from '../redis/redis.dto';

@Injectable()
export class AuthService {
  discordService: DiscordOauth2;

  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly telegramService: TelegramService,
    private readonly redisService: RedisService
  ) {
    this.discordService = new DiscordOauth2({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
      redirectUri: Configuration.getClientLink() + '/login/callback',
    });
  }

  async discordCallback(code: string) {
    let token: DiscordOauth2.TokenRequestResult
    try {
      token = await this.discordService.tokenRequest({
        code: code,
        grantType: 'authorization_code',
        scope: ['identify', 'guilds']
      });
    } catch (_) {
      throw new BadRequestException()
    }
  
    const payload: AuthPayload = await this.discordService.getUser(token.access_token)
      .then(payload => {
        return {
          id: payload.id,
          avatar: payload.avatar
            ? `https://cdn.discordapp.com/avatars/${payload.id}/${payload.avatar}.png`
            : '',
          email: payload.email,
          displayName: payload.global_name || payload.username + '#' + payload.discriminator,
          lang: payload.locale,
          type: 'discord' as $Enums.LoginType
        }
      })
      .catch(_ => { throw new BadRequestException() });
  
    return this.register(payload)
  }
  

  getDiscordAuthUrl(): string {
    return this.discordService.generateAuthUrl({
      scope: ['identify', 'guilds'],
      redirectUri: Configuration.getClientLink() + '/login/callback'
    });
  }

  async login(token: string): Promise<UserEntity> {
    const { email, uid } = this.userService.decodeJWT(token);

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

  async register({ id, type, avatar, displayName, lang, email }: AuthPayload) {
    let login = await this.prisma.login.findUnique({
      where: { id, type },
    });
  
    if (login) {
      login = await this.prisma.login.update({
        where: { id, type },
        data: { avatar, displayName, lang, on: new Date() },
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
          lang,
          uid,
        },
      });
    }
    
    const JWT = this.userService.signJWT(login.uid, email)
    return {
      authorization: this.parseToken(JWT),
      language: lang,
    };
  }

  async getTelegramAuthUrl(uuid: string) {
    const isExist = await this.redisService.get(`${dataset.telegram_logins}:${uuid}`);
    if (isExist) throw new ConflictException;

    await this.redisService.setex(`${dataset.telegram_logins}:${uuid}`, 300, uuid);
    return `https://t.me/impactium_bot?start=${uuid}`
  }

  async telegramCallback(uuid: string) {
    const payload = await this.redisService.get(`${dataset.telegram_logins}:${uuid}`).then(user => JSON.parse(user)) as AuthPayload;

    return this.register(payload)

  }

  parseToken (token: string): string {
    return token.startsWith('Bearer') ? token : `Bearer ${token}`
  }
}
