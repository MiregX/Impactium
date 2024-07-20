import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AuthPayload, AuthResult } from './addon/auth.entity';
import { Configuration } from '@impactium/config';
import { AuthService } from './auth.service';
import { AuthMethodService } from './addon/auth.interface';
import { UUID } from 'crypto';
import { Request } from 'express'
import { EnvironmentKeyNotProvided } from '../application/addon/error';
const SteamAuth = require('node-steam-openid');

@Injectable()
export class SteamAuthService extends SteamAuth implements AuthMethodService {
  constructor(private readonly authService: AuthService) {
    super(process.env.STEAM_API_KEY ? {
      realm: Configuration._server(),
      returnUrl: Configuration._server() + '/api/oauth2/steam/callback',
      apiKey: process.env.STEAM_API_KEY
    } : (() => { throw new EnvironmentKeyNotProvided('STEAM_API_KEY') })());
  }

  getUrl = (): Promise<string> => this.getRedirectUrl()

  async callback(request: Request, uuid: string): Promise<AuthResult> {
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
