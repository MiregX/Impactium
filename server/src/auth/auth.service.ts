import { Injectable } from '@nestjs/common';
import DiscordOauth2 = require('discord-oauth2');
import { UsersService } from 'src/users/users.service';
import passport = require('passport');
import { Strategy } from 'passport-google-oauth2';
import { AuthPayload, LoginDto, LoginPayload } from 'src/users/dto/user.dto';

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

  constructor(private userService: UsersService) {
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
    const type = "discord";
    const token: DiscordOauth2.TokenRequestResult = await this.oauth.tokenRequest({
      code: code,
      grantType: 'authorization_code',
      scope: ['identify', 'guilds']
    })
    const fetchedUser = await this.oauth.getUser(token.access_token);
  
    const user = this.userService.findUniqueOrCreate(fetchedUser);
  
    const payload: LoginDto = {
      type: 'discord',
      displayName: fetchedUser.global_name || fetchedUser.username + fetchedUser.discriminator,
      locale: fetchedUser.locale || "en",
      id: '',
      avatar: '',
      user: {
        connect: { id: user.id } // Привязываем логин к пользователю
      }
    }
  
    const jwtoken = this.userService.create({
      ...payload,
      lastLogin: type
    });
    return jwtoken;
  }

  getDiscordAuthUrl(): string {
    return this.oauth.generateAuthUrl({
      scope: ['identify', 'guilds']
    });
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