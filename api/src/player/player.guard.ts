import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PlayerService } from './player.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Injectable()
export class PlayerGuard implements CanActivate {
  constructor(
    private readonly playerService: PlayerService,
    private readonly authGuard: AuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      const isAuth = await this.authGuard.canActivate(context);
      if (!isAuth)
        return false;
    }

    request.player = await this.playerService.findOneByIdOrCreate(request.user.id);
    return true;
  }
}

@Injectable()
export class GetPlayerGuard implements CanActivate {
  constructor(private readonly playerGuard: PlayerGuard) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.body.nickname || request.body.nicknames) {
      return true;
    }
    return this.playerGuard.canActivate(context);
  }
}
