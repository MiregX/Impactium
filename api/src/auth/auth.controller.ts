import { Controller, Get, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import passport from 'passport';
import { Configuration } from '@impactium/config';
import { FastifyReply } from 'fastify';

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
  async discordGetCallback(@Query('code') code: string) {
    const token = await this.authService.discordCallback(code)
    return { url: Configuration.getClientLink() + '/login/callback?token=' + token };
  }

  @Post('callback/discord')
  async discordPostCallback(
    @Query('code') code: string,
    @Res({ passthrough: true }) response: FastifyReply
  ) {
    const { authorization, language } = await this.authService.discordCallback(code);
    response.setCookie('Authorization', authorization);
    response.setCookie('_language', language);
  }

  @Get('login/discord')
  @Redirect()
  getDiscordAuthUrl() {
    return { url: this.authService.getDiscordAuthUrl() };
  }
}
