import { Injectable } from '@nestjs/common';
import DiscordOauth2 = require('discord-oauth2');
import { UsersService } from 'src/users/users.service';
import passport = require('passport');
import { Strategy } from 'passport-google-oauth2';

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

  async discordAuth(code: string) {
    const type = "discord";
    const token: DiscordOauth2.TokenRequestResult = await this.oauth.tokenRequest({
      code: code,
      grantType: 'authorization_code',
      scope: ['identify', 'guilds']
    })
    const user = await this.oauth.getUser(token.access_token);
    // User {
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

    const jwtoken = this.userService.create({
      ...user,
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

// // router.use((err, req, res, next) => {
// //   res.redirect('https://impactium.fun/error');
// // });

// router.get('/login/google', passport.authenticate('google'));

// router.get('/callback/google', (request, response, next) => {
//   passport.authenticate('google', (err, user, info) => {
//     if (err) {
//       return response.sendStatus(500);
//     }

//     try {
//       userAuthentication({data: user._json, from: "google", referal: request.query.referal}).then(authResult => {
//         return response.redirect(`https://impactium.fun/login/callback?token=${authResult.token}&lang=${authResult.lang}`);
//       });
//     } catch (error) {
//       return response.redirect('/');
//     }
//   })(request, response, next);
// });