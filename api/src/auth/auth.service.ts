import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import DiscordOauth2 = require('discord-oauth2');
import { UserService } from 'src/user/user.service';
import passport = require('passport');
import { Strategy } from 'passport-google-oauth2';
import { UserEntity } from 'src/user/entities/user.entity';
import { DiscordAuthPayload } from './entities/auth.entity';
import { LoginService } from 'src/user/login.service';
import { ApplicationService } from 'src/application/application.service';
import { Configuration } from '@impactium/config';

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
      redirectUri: Configuration.getClientLink() + '/login/callback',
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

    const payload: DiscordAuthPayload = await this.oauth.getUser(token.access_token)
    .then(payload => {
      return {
        ...payload,
        type: 'discord',
      }
    })
    .catch(_ => { console.log(_); throw new BadRequestException()}) as DiscordAuthPayload;

    const user = payload.email ? {
      connectOrCreate: {
        where: { email: payload.email },
        create: { email: payload.email, lastLogin: payload.type }
      }
    } : {
      create: { lastLogin: payload.type }
    };
    
    const login = await this.loginService.findUniqueOrCreate({
      id: payload.id,
      type: payload.type,
      avatar: payload.avatar
        ? `https://cdn.discordapp.com/avatars/${payload.id}/${payload.avatar}.png`
        : '',
      displayName: payload.global_name || payload.username + '#' + payload.discriminator,
      locale: payload.locale,
      user: user
    });

    return `Bearer ${this.userService.signJWT(login.uid, payload.email)}`;
  }

  getDiscordAuthUrl(): string {
    return this.oauth.generateAuthUrl({
      scope: ['identify', 'guilds'],
      redirectUri: Configuration.getClientLink() + '/login/callback'
    });
  }

  async login(token: string): Promise<UserEntity> {
    const { email, id } = this.userService.decodeJWT(token);
    if (email) {
      return await this.userService.findOneByEmail(email);
    }
    else if (id) {
      return await this.userService.findOneById(id);
    }
    else {
      throw new NotFoundException();
    }
  }
}
