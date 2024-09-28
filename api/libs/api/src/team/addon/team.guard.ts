import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { TeamService } from '../team.service';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { AuthGuard } from '@api/main/auth/addon/auth.guard';
import { AdminGuard } from '@api/main/auth/addon/admin.guard';
import { λthrow } from '@impactium/utils';

/**
 * Для проверки, является ли пользователь сделавший реквест владельцем команды
 * 
 * Если пользователя нет, сначала проверит и добавит в реквест
 * 
 * Проверяет по базе данных где ownerId === user.uid
 * 
 * Добавляет request.team которое доступно по @Team(): TeamEntity
*/
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


/**
 * Для проверки, существует ли команда по indent
 * 
 * Проходит без юзера
*/
@Injectable()
export class TeamReadonlyGuard implements CanActivate {
  constructor(
    private teamService: TeamService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    request.team = await this.teamService.findOneByIndent(request.params.indent);

    if (!request.team) λthrow(NotFoundException);

    return true;
  }
}