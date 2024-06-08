import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import DiscordOauth2 = require('discord-oauth2');
import { AuthPayload } from './addon/auth.entity';
import { Configuration } from '@impactium/config';
import { $Enums } from '@prisma/client';
import { AuthService } from './auth.service';
import { AuthMethod } from './addon/auth.interface';
import { UUID } from 'crypto';

@Injectable()
export class DiscordAuthService extends DiscordOauth2 implements AuthMethod {
  scope: string[] = ['identify', 'guilds', 'email'];

  constructor(
    private readonly authService: AuthService
  ) {
    super({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
      redirectUri: Configuration._server() + '/api/oauth2/discord/callback',
    });
  }

  async callback(code: string, uuid?: UUID) {
    const token = await this.tokenRequest({
      code: code,
      grantType: 'authorization_code',
      scope: this.scope
    });

    if (!token) throw new BadRequestException();

    const payload: AuthPayload = await this.getUser(token.access_token)
      .then(payload => ({
        id: payload.id,
        avatar: payload.avatar
          ? `https://cdn.discordapp.com/avatars/${payload.id}/${payload.avatar}.png`
          : '',
        email: payload.email,
        displayName: payload.global_name || payload.username + '#' + payload.discriminator,
        lang: payload.locale,
        type: 'discord' as $Enums.LoginType
      }))
      .catch(error => {
        console.log(error)
        throw new InternalServerErrorException()
      });
    
    payload.uid = uuid && await this.authService.getPayload(uuid) as string;
  
    return this.authService.register(payload)
  }
  

  getUrl(uuid: string) {
    return this.generateAuthUrl({
      scope: this.scope,
      redirectUri: Configuration._server() + '/api/oauth2/discord/callback',
    });
  }
}
