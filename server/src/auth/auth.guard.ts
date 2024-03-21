import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { id, email } = request.headers.authorization?.split(' ')[1];
    if (!id && !email)
      return false;

    request.user = await this.authService.login({
      email: email,
      id: id,
    });
    return true;
  }
}