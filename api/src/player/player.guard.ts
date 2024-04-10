import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PlayerService } from './player.service';

@Injectable()
export class PlayerGuard implements CanActivate {
  constructor(private readonly playerService: PlayerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.Authorization || request.headers.authorization

    if (!request.user.id)
      return false;

    request.player = await this.playerService.findOneByIdOrCreate(request.user.id);
    return true;
  }
}