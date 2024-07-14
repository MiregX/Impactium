import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request, Response } from 'express';
import { UserEntity } from '@api/main/user/addon/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const token = request.cookies.Authorization || request.headers.token

    request.user = token ? await this.authService.login(token.split(' ')[1]) : null;
    
    if (!token || !request.user) {
      request.method === 'GET' && response.redirect('/');
      return false;
    }

    console.log(!!request.user);

    return !!request.user;
  }
}