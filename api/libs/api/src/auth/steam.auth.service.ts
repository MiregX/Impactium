import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AuthPayload, AuthResult } from './addon/auth.entity';
import { Configuration } from '@impactium/config';
import { $Enums } from '@prisma/client';
import * as passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import { AuthService } from './auth.service';

@Injectable()
export class SteamAuthService {
  constructor(private readonly authService: AuthService) {
    passport.use(
      new SteamStrategy(
        {
          returnURL: `${Configuration.getClientLink()}/steam/callback`,
          realm: Configuration.getClientLink(),
          apiKey: process.env.STEAM_API_KEY,
        },
        async (identifier: string, profile: any, done: (err: any, user?: any) => void) => {
          console.log(profile);
          try {
            const payload: AuthPayload = {
              id: profile.id,
              avatar: profile.photos[2]?.value || '',
              email: '', // Steam не предоставляет email
              displayName: profile.displayName,
              lang: '', // Steam не предоставляет информацию о языке
              type: 'steam' as $Enums.LoginType,
            };
            const result = await this.authService.register(payload);
            done(null, result);
          } catch (error) {
            done(error);
          }
        },
      ),
    );
  }

  getUrl(): string {
    // URL для аутентификации через Steam
    return '/auth/steam';
  }

  async callback(identifier: string): Promise<AuthResult> {
    return new Promise((resolve, reject) => {
      passport.authenticate('steam', (error: Error, result: AuthResult, info) => {
        if (error || !result) {
          return reject(new BadRequestException());
        }
        resolve(result);
      })({ query: { 'openid.claimed_id': identifier } });
    });
  }
}
