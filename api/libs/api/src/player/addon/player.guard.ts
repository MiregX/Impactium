import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PlayerService } from '../player.service';
import { AuthGuard } from '@api/main/auth/addon/auth.guard';

@Injectable()
export class PlayerGuard implements CanActivate {
  constructor(
    private readonly playerService: PlayerService,
    private readonly authGuard: AuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      await this.authGuard.canActivate(context);
    }

    request.player = await this.playerService.findOneById(request.user.id);
    return true;
  }
}
