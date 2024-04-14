import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.Authorization || request.headers.authorization

    if (!token)
      return false;

    request.user = await this.authService.login(token.split(' ')[1]);
    return !!request.user;
  }
}