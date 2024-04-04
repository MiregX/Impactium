import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import DiscordOauth2 = require('discord-oauth2');
import { UserService } from 'src/user/user.service';
import passport = require('passport');
import { Strategy } from 'passport-google-oauth2';
import { UserEntity } from 'src/user/entities/user.entity';
import { DiscordAuthPayload } from './entities/auth.entity';
import { LoginService } from 'src/user/login.service';
import { ApplicationService } from 'src/application/application.service';

@Injectable()
export class AuthService {
  oauth: DiscordOauth2;
  strategy: Strategy;

  constructor(
    private readonly userService: UserService,
    private readonly loginService: LoginService,
    private readonly applicationService: ApplicationService,
  ) {
    this.oauth = new DiscordOauth2({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
      redirectUri: process.env.DISCORD_CALLBACK,
    });

    this.strategy = new Strategy({
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
      scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        done(null, profile)
      } catch (_) {
        done(_)
      }
    });

    passport.use(this.strategy);
  }

  async getGoogleAuthUrl() {
    
  }

  async googleCallback() {

  }

  async discordCallback(code: string) {
    const token: DiscordOauth2.TokenRequestResult = await this.oauth.tokenRequest({
      code: code,
      grantType: 'authorization_code',
      scope: ['identify', 'guilds']
    });

    const {
      id,
      email,
      avatar,
      locale,
      username,
      global_name,
      discriminator,
      type = 'discord',
    }: DiscordAuthPayload = await this.oauth.getUser(token.access_token)
    .then(data => {
      return {
        ...data,
        type: 'discord'
      }
    })
    .catch(_ => { throw new BadRequestException()}) as DiscordAuthPayload;

    const login = await this.loginService.findUniqueOrCreate({
      id,
      type,
      avatar: avatar
        ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`
        : '',
      displayName: global_name || username + '#' + discriminator,
      locale,
      user: {
        connectOrCreate: {
          where: {
            email: email
          },
          create: {
            email: email,
            lastLogin: type
          }
        }
      }
    });
    
    return this.userService.signJWT(login.userId, email);
  }

  getDiscordAuthUrl(): string {
    return this.oauth.generateAuthUrl({
      scope: ['identify', 'guilds'],
      redirectUri: this.applicationService.getClientLink() + '/login/callback'
    });
  }

  async login({email, id}): Promise<UserEntity> {
    if (email) {
      return await this.userService.findOneByEmail(email);
    }
    else if (id) {
      return await this.userService.findOneById(id);
    }
    else {
      throw new NotFoundException()
    }
  }
}

// DiscordCallbackLoginPayload {
//   "id": "502511293798940673",
//   "username": "mireg",
//   "avatar": "c57298e36a702cccd7337341d19c1be5",
//   "discriminator": "0",
//   "public_flags": 128,
//   "premium_type": 0,
//   "flags": 128,
//   "banner": null,
//   "accent_color": 65793,
//   "global_name": "Mireg",
//   "avatar_decoration_data": null,
//   "banner_color": "#010101",
//   "mfa_enabled": true,
//   "locale": "uk",
//   "email": "markgerasimchuk8@gmail.com",
//   "verified": true
// }