import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TournamentStandart } from './addon/tournament.standart';
import { TournamentEntity, TournamentEntityWithTeams } from './addon/tournament.entity';

@Injectable()
export class TournamentService {
  constructor(
    private readonly prisma: PrismaService
  ) {}
  
  async pagination(
    limit: number = TournamentStandart.DEFAULT_PAGINATION_LIMIT,
    skip: number = TournamentStandart.DEFAULT_PAGINATION_PAGE,
  ): Promise<TournamentEntity<TournamentEntityWithTeams>[]> {
    return this.prisma.tournament.findMany({
      select: TournamentEntity.selectWithTeams(),
      take: limit,
      skip: skip,
    });
  }
};
