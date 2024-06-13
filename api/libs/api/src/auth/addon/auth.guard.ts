import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const token = request.cookies.Authorization || request.headers.token

    request.user = await this.authService.login(token.split(' ')[1]);
    
    if (!token || !request.user) {
      request.method === 'GET' && response.redirect('/');
      return false;
    }

    request.user = await this.authService.login(token.split(' ')[1]);
    return !!request.user;
  }
}