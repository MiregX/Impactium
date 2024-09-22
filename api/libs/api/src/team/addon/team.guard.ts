import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { TeamService } from '../team.service';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { AuthGuard } from '@api/main/auth/addon/auth.guard';
import { AdminGuard } from '@api/main/auth/addon/admin.guard';

@Injectable()
export class TeamGuard implements CanActivate {
  constructor(
    private teamService: TeamService,
    private authGuard: AuthGuard,
    private adminGuard: AdminGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      await this.authGuard.canActivate(context); 
    }

    const isAdmin = await this.adminGuard.canActivate(context);

    const { uid }: UserEntity = request.user

    request.team = (await this.teamService.findManyByUid(uid)).find(team => team.indent === request.params.indent) || (isAdmin && await this.teamService.findOneByIndent(request.params.indent));

    return !!request.team;
  }
}