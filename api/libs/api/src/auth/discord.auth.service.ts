import { ForbiddenException, Injectable } from '@nestjs/common';
import DiscordOauth2 = require('discord-oauth2');
import { AuthPayload, Token } from './addon/auth.entity';
import { Configuration } from '@impactium/config';
import { $Enums } from '@prisma/client';
import { AuthService } from './auth.service';
import { AuthMethodService } from './addon/auth.interface';
import { UUID } from 'crypto';
import { EnvironmentKeyNotProvided } from '../application/addon/error';

@Injectable()
export class DiscordAuthService extends DiscordOauth2 implements AuthMethodService {
  scope: string[] = ['identify', 'guilds', 'email'];

  constructor(
    private readonly authService: AuthService
  ) {
    if (!process.env.DISCORD_ID) throw new EnvironmentKeyNotProvided('DISCORD_ID');
    
    if (!process.env.DISCORD_SECRET) throw new EnvironmentKeyNotProvided('DISCORD_SECRET');

    super({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
      redirectUri: Configuration._server() + '/api/oauth2/discord/callback',
    });
  }

  async callback(code: string, uuid?: UUID): Promise<Token> {
    const token: any | null = await this.tokenRequest({
      code: code,
      grantType: 'authorization_code',
      scope: this.scope
    }).catch(_ => null);

    if (!token) throw ForbiddenException;

    const payload: AuthPayload = await this.getUser(token.access_token)
      .then(payload => ({
        id: payload.id,
        avatar: payload.avatar ? `https://cdn.discordapp.com/avatars/${payload.id}/${payload.avatar}.png` : null,
        email: payload.email as string,
        displayName: payload.global_name || payload.username + '#' + payload.discriminator,
        lang: payload.locale,
        type: 'discord' as $Enums.LoginType
      }))
      .catch(_ => {
        throw ForbiddenException
      });
    
    payload.uid = uuid && await this.authService.getPayload(uuid) as string;
  
    return this.authService.register(payload)
  }
  

  getUrl() {
    return this.generateAuthUrl({
      scope: this.scope,
      redirectUri: Configuration._server() + '/api/oauth2/discord/callback',
    });
  }
}
