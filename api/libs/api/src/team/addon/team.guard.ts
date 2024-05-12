import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { TeamService } from '../team.service';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { AuthGuard } from '@api/main/auth/addon/auth.guard';

@Injectable()
export class TeamGuard implements CanActivate {
  constructor(
    private teamService: TeamService,
    private authGuard: AuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      await this.authGuard.canActivate(context); 
    }

    const user: UserEntity = request.user

    const userTeams = await this.teamService.findManyByUid(request.user.uid)
    
    if (user && !userTeams.some(team => team.indent === request.params.indent)) {
      return false;
    }

    return !!request.team;
  }
}