import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Redirect } from '@nestjs/common';
import DiscordOauth2 = require('discord-oauth2');
import { AuthPayload, AuthResult } from './addon/auth.entity';
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
    super(process.env.DISCORD_ID && process.env.DISCORD_SECRET ? {
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
      redirectUri: Configuration._server() + '/api/oauth2/discord/callback',
    } : (() => { throw new EnvironmentKeyNotProvided('DISCORD_ID || DISCORD_SECRET') })());
  }

  async callback(code: string, uuid?: UUID): Promise<AuthResult> {
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
