import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import DiscordOauth2 = require('discord-oauth2');
import { UserService } from '@api/main/user/user.service';
import { UserEntity } from '@api/main/user/entities/user.entity';
import { AuthPayload } from './entities/auth.entity';
import { Configuration } from '@impactium/config';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { $Enums } from '@prisma/client';

@Injectable()
export class AuthService {
  oauth: DiscordOauth2;

  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {
    this.oauth = new DiscordOauth2({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
      redirectUri: Configuration.getClientLink() + '/login/callback',
    });
  }

  async discordCallback(code: string) {
    let token: DiscordOauth2.TokenRequestResult
    try {
      token = await this.oauth.tokenRequest({
        code: code,
        grantType: 'authorization_code',
        scope: ['identify', 'guilds']
      });
    } catch (_) {
      throw new BadRequestException()
    }
  
    const payload: AuthPayload = await this.oauth.getUser(token.access_token)
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
    return this.oauth.generateAuthUrl({
      scope: ['identify', 'guilds'],
      redirectUri: Configuration.getClientLink() + '/login/callback'
    });
  }

  async login(token: string): Promise<UserEntity> {
    const { email, uid } = this.userService.decodeJWT(token);
    if (email) {
      return await this.userService.findOneByEmail(email);
    }
    else if (uid) {
      return await this.userService.findOneById(uid);
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
      const user = email
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
          user: { connect: { uid: user.uid } },
        },
      });
    }
  
    return {
      authorization: this.parseToken(this.userService.signJWT(login.uid, email)),
      language: lang,
    };
  }

  parseToken (token: string): string {
    return token.startsWith('Bearer') ? token : `Bearer ${token}`
  }
}
