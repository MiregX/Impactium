import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AuthPayload, AuthResult } from './addon/auth.entity';
import { Configuration } from '@impactium/config';
import { AuthService } from './auth.service';
import { AuthMethod } from './addon/auth.interface';
const SteamAuth = require('node-steam-openid');

@Injectable()
export class SteamAuthService extends SteamAuth implements AuthMethod {
  constructor(private readonly authService: AuthService) {
    super({
      realm: Configuration._server(),
      returnUrl: Configuration._server() + '/api/oauth2/steam/callback',
      apiKey: process.env.STEAM_API_KEY
    });
  }

  getUrl = (): Promise<string> => this.getRedirectUrl()

  async callback(request: Request): Promise<AuthResult> {
    const payload: AuthPayload = await this.authenticate(request).then(user => ({
      id: user.steamid,
      lang: 'ru',
      type: 'steam',
      displayName: user.username,
      avatar: user.avatar.medium,
    }))
    return this.authService.register(payload)
  }
}
