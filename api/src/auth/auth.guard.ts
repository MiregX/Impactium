import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request.headers);
    const token = request.headers.authorization?.split(' ')[1] || request.headers.cookie.split(' ')[1];
    if (!token) {
      return false;
    }

    request.user = await this.authService.login(token);
    return true;
  }
}