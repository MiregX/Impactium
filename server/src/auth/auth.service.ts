import { Injectable, NotFoundException } from '@nestjs/common';
import DiscordOauth2 = require('discord-oauth2');
import { UsersService } from 'src/user/user.service';
import passport = require('passport');
import { Strategy } from 'passport-google-oauth2';
import { AuthPayload, DiscordAuthPayload } from './entities/auth.entity';
import { CreateLoginDto } from 'src/user/dto/login.dto';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { LoginEntity } from 'src/user/entities/login.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entities/user.entity';
// passport.initialize()
// passport.session()

// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//   done(null, user);
// });

// passport.use(new Strategy({
//   clientID: process.env.GOOGLE_ID,
//   clientSecret: process.env.GOOGLE_SECRET,
//   callbackURL: process.env.GOOGLE_CALLBACK || 'http://localhost:3000/api/oauth2/callback/google',
//   scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     done(null, profile)
//   } catch (error) {
//     console.log(error);
//     done(error)
//   }
// }));

@Injectable()
export class AuthService {
  oauth: DiscordOauth2;
  strategy: Strategy;

  constructor(
    private readonly userService: UsersService, 
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    this.oauth = new DiscordOauth2({
      clientId: "1123714909356687360",
      clientSecret: "NUOXvdx47wOb59vMEm0h8UQBu6S9PLOo",
      redirectUri: "http://localhost:3000/api/oauth2/callback/discord",
    });

    this.strategy = new Strategy({
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK || 'http://localhost:3000/api/oauth2/callback/google',
      scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        done(null, profile)
      } catch (error) {
        console.log(error);
        done(error)
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

    const discordUser = await this.oauth.getUser(token.access_token);

    const login = await this.prisma.login.upsert({
      where: { id: discordUser.id },
      update: {
        avatar: discordUser.avatar
          ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
          : '',
        displayName: discordUser.global_name || discordUser.username + '#' + discordUser.discriminator,
        locale: discordUser.locale || 'us',
        user: {
          connectOrCreate: {
            where: { email: discordUser.email },
            create: {
              email: discordUser.email,
              lastLogin: 'discord',
            },
          },
        },
      },
      create: {
        id: discordUser.id,
        type: 'discord',
        avatar: discordUser.avatar
          ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
          : '',
        displayName: discordUser.global_name || discordUser.username + '#' + discordUser.discriminator,
        locale: discordUser.locale || 'us',
        user: {
          connectOrCreate: {
            where: { email: discordUser.email },
            create: {
              email: discordUser.email,
              lastLogin: 'discord',
            },
          },
        },
      },
    });    

    const jwt = this.jwtService.sign({
      id: login.userId,
      email: discordUser.email,
    },{
      secret: 'secret'      
    });
    
    return jwt;
  }

  getDiscordAuthUrl(): string {
    return this.oauth.generateAuthUrl({
      scope: ['identify', 'guilds'],
      redirectUri: process.env.DISCORD_CALLBACK
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