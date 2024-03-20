import { Controller, Get, Query, Redirect, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import passport from 'passport';

@Controller('oauth2')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login/google')
  googleLogin() {
    passport.authenticate('google', { scope: ['profile'] });
  }

  @Get('callback/google')
  googleLoginCallback(@Req() req, @Res() res) {
    // passport.authenticate('google', { failureRedirect: '/login' });
    // const jwt: string = req.user.jwt;
    // if (jwt) res.redirect(`${process.env.DOMAIN || 'http:localhost'}/login/callback?token=` + jwt);
    // else res.redirect(process.env.DOMAIN || 'http:localhost');
  }

  @Get('callback/discord')
  @Redirect()
  async discordCallback(@Query('code') code: string) {
    const token = await this.authService.discordCallback(code)
    return { url: process.env.DOMAIN + '/login/callback?token=' + token };
  }

  @Get('login/discord')
  @Redirect()
  getDiscordAuthUrl() {
    return { url: this.authService.getDiscordAuthUrl() };
  }
}
