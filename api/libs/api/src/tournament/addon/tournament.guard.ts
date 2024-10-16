import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { AuthGuard } from '@api/main/auth/addon/auth.guard';
import { λthrow } from '@impactium/utils';
import { TournamentService } from '../tournament.service';
import { TournamentEntity } from './tournament.entity';
import { Identifier } from '@impactium/pattern';
import { CodeInvalidFormat, CodeNotProvided } from '@api/main/application/addon/error';

/**
 * Для проверки, существует ли турнир по code
 * 
 * Проходит без юзера
*/
@Injectable()
export class TournamentExistanseGuard implements CanActivate {
  constructor(
    private tournamentService: TournamentService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.params.code) λthrow(CodeNotProvided);

    if (!Identifier.test(request.params.code)) λthrow(CodeInvalidFormat);

    request.tournament = await this.tournamentService.find(request.params.code);

    return !!request.tournament;
  }
}


/**
 * Для проверки, является ли пользователь сделавший реквест владельцем турнира
 * 
 * Если пользователя нет, сначала проверит и добавит в реквест
 * 
 * Проверяет по базе данных где ownerId === user.uid
 * 
 * Добавляет request.tournament которое доступно по @Tournament(): TournamentEntity
*/
@Injectable()
export class TournamentGuard implements CanActivate {
  constructor(
    private readonly tournamentExistanseGuard: TournamentExistanseGuard,
    private readonly authGuard: AuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.tournament) await this.tournamentExistanseGuard.canActivate(context); 

    if (!request.user) await this.authGuard.canActivate(context); 
    
    const { uid }: UserEntity = request.user
    const { ownerId }: TournamentEntity = request.tournament

    return ownerId === uid;
  }
}
