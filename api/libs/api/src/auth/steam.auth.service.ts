import { Injectable } from '@nestjs/common';
import { AuthPayload, Token } from './addon/auth.entity';
import { AuthService } from './auth.service';
import { AuthMethodService } from './addon/auth.interface';
import { UUID } from 'crypto';
import { Request } from 'express'
import { EnvironmentKeyNotProvided } from '../application/addon/error';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SteamAuth = require('node-steam-openid');
import { Configuration } from 'src/configuration';

@Injectable()
export class SteamAuthService extends SteamAuth implements AuthMethodService {
  constructor(private readonly authService: AuthService) {
    super(process.env.STEAM_API_KEY ? {
      realm: Configuration.link(),
      returnUrl: Configuration.link() + '/api/oauth2/steam/callback',
      apiKey: process.env.STEAM_API_KEY
    } : (() => { throw new EnvironmentKeyNotProvided('STEAM_API_KEY') })());
  }

  getUrl = (): Promise<string> => this.getRedirectUrl()

  async callback(request: Request, uuid: string): Promise<Token> {
    const payload: AuthPayload = await this.authenticate(request).then(user => ({
      id: user.steamid,
      lang: 'ru',
      type: 'steam',
      displayName: user.username,
      avatar: user.avatar.medium,
    }))
    payload.uid = uuid && await this.authService.getPayload(uuid as UUID) as string;
    return this.authService.register(payload)
  }
}
