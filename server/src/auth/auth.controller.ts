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
    passport.authenticate('google', { failureRedirect: '/login' });
    const jwt: string = req.user.jwt;
    if (jwt) res.redirect('http://localhost/login/callback?token=' + jwt);
    else res.redirect('http://localhost');
  }

  @Get('callback/discord')
  discordAuth(@Query('code') code: string) {
    return this.authService.discordAuth(code);
  }

  @Get('login/discord')
  @Redirect()
  getDiscordAuthUrl() {
    return { url: this.authService.getDiscordAuthUrl() };
  }
}
