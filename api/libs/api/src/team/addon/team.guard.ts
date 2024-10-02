import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { TeamService } from '../team.service';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { AuthGuard } from '@api/main/auth/addon/auth.guard';
import { TeamEntity } from './team.entity';

/**
 * Для проверки, существует ли команда по indent
 * 
 * Проходит без юзера
*/
@Injectable()
export class TeamExistanseGuard implements CanActivate {
  constructor(
    private teamService: TeamService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    request.team = await this.teamService.findOneByIndent(request.params.indent);

    return !!request.team;
  }
}


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
    private readonly teamExistanseGuard: TeamExistanseGuard,
    private readonly authGuard: AuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user) await this.authGuard.canActivate(context);

    if (!request.team) await this.teamExistanseGuard.canActivate(context);

    const { uid }: UserEntity = request.user
    const { ownerId }: TeamEntity = request.team

    return uid === ownerId;
  }
}


/**
 * Для проверки, является ли пользователь сделавший реквест участником команды
 * 
 * Если пользователя нет, сначала проверит и добавит в реквест
 * 
 * Проверяет по базе данных где team.members.some(member => member.uid === user.uid)
 * 
 * Добавляет request.team которое доступно по @Team(): TeamEntity
*/
@Injectable()
export class TeamMemberGuard implements CanActivate {
  constructor(
    private readonly teamExistanseGuard: TeamExistanseGuard,
    private authGuard: AuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.team) await this.teamExistanseGuard.canActivate(context);

    if (!request.user) await this.authGuard.canActivate(context); 

    const { uid }: UserEntity = request.user;
    const { members }: Required<TeamEntity> = request.team;

    return members!.some(member => member.uid === uid);
  }
}
