import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TournamentStandart } from './addon/tournament.standart';
import { TournamentEntity, TournamentEntityWithTeams } from './addon/tournament.entity';
import { addWeeks, addDays, getMonth } from 'date-fns';
import { UserEntity } from '../user/addon/user.entity';
import { Logger } from '@nestjs/common';
import { TeamEntity } from '../team/addon/team.entity';
import { λIteration, λIterations } from '@impactium/pattern';
import { BattleFormat, EliminationType } from '@prisma/client';

@Injectable()
export class TournamentService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async onModuleInit() {
    await this.insertBattleCups();
  }
    
  async pagination(
    limit: number = TournamentStandart.DEFAULT_PAGINATION_LIMIT,
    skip: number = TournamentStandart.DEFAULT_PAGINATION_PAGE,
  ) {
    const actual = TournamentEntity.findActual();
    return await this.prisma.tournament.findMany({
      select: TournamentEntity.select({ teams: true }),
      take: limit,
      skip: skip,
      ...actual
    });
  }

  async insertBattleCups() {
    const today = new Date();

    const nextFriday = new Date(today);
    nextFriday.setUTCDate(today.getUTCDate() + ((5 - today.getUTCDay() + 7) % 7));
    nextFriday.setUTCHours(20, 0, 0, 0);
  
    const fridays = Array.from({ length: 4 }, (_, i) => addWeeks(nextFriday, i));
    if (!fridays.length) Logger.error(fridays, 'TournamentService');
  
    for (const friday of fridays) {
      await this.prisma.tournament.findFirst({
        where: {
          ownerId: 'system',
          start: friday,
        },
      }).then((battleCup) => {
        !battleCup && this.createBattleCup(friday);
      });
    }
  }

  delete(user: UserEntity, id: string) {
    return this.prisma.tournament.delete({
      where: { id, ownerId: user.uid }
    });
  }
  
  findOneByCode(code: string) {
    return this.prisma.tournament.findUnique({
      select: TournamentEntity.select({ teams: true, owner: true }),
      where: { code }
    });
  }

  join(tournament: TournamentEntity, team: TeamEntity) {
    return this.prisma.tournament.update({
      where: {
        code: tournament.code
      },
      data: {
        teams: {
          connect: {
            indent: team.indent
          }
        }
      },
      select: TournamentEntity.select({ teams: true })
    })
  }

  private async createBattleCup(date: Date) {
    await this.prisma.tournament.create({
      data: {
        banner: 'https://cdn.impactium.fun/logo/battle_cup.png',
        title: `Friday Battle Cup ${getMonth(date) + 1}/${date.getDate()}`,
        start: date,
        end: addDays(date, 1),
        description: '$tournament.battle_cup_description',
        code: `battle-cup_${getMonth(date) + 1}-${date.getDate()}`,
        rules: '$tournament.battle_cup_rules',
        owner: {
          connect: {
            uid: 'system'
          }
        },
        live: 'https://twitch.tv/impactium',
        prize: 50,
        eliminationType: EliminationType.DOUBLE,
        formats: {
          createMany: {
            data: [
              {
                n: λIterations[16],
                format: BattleFormat.BO1
              },
              {
                n: λIterations[8],
                format: BattleFormat.BO1
              },
              {
                n: λIterations[4],
                format: BattleFormat.BO1
              },
              {
                n: λIterations[2],
                format: BattleFormat.BO3
              },
            ]
          }
        }
      }
    }).then(tournament => Logger.log(tournament));
  }
};
