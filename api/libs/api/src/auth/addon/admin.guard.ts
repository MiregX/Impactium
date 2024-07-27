import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@api/main/auth/addon/auth.guard';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private authGuard: AuthGuard) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      await this.authGuard.canActivate(context); 
    }

    return request.user.uid === 'system'
  }
}