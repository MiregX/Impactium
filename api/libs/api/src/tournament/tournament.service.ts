import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TournamentStandart } from './addon/tournament.standart';
import { TournamentEntity, TournamentEntityWithTeams } from './addon/tournament.entity';
import { addWeeks, addDays, getMonth } from 'date-fns';
import { UserEntity } from '../user/addon/user.entity';

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
  ): Promise<TournamentEntity<TournamentEntityWithTeams>[]> {
    return await this.prisma.tournament.findMany({
      ...TournamentEntity.selectWithTeams(),
      take: limit,
      skip: skip
    });
  }

  async insertBattleCups() {
    const today = new Date();

    const nextFriday = new Date(today);
    nextFriday.setUTCDate(today.getUTCDate() + ((5 - today.getUTCDay() + 7) % 7));
    nextFriday.setUTCHours(20, 0, 0, 0);
  
    const fridays = Array.from({ length: 4 }, (_, i) => addWeeks(nextFriday, i));
  
    for (const friday of fridays) {
      this.prisma.tournament.findFirst({
        where: {
          ownerId: 'system',
          start: friday,
        },
      }).then(battleCup => !battleCup && this.createBattleCup(friday));
    }
  }

  delete(user: UserEntity, id: string) {
    return this.prisma.tournament.delete({
      where: { id, ownerId: user.uid }
    });
  }

  private createBattleCup(date: Date) {
    this.prisma.tournament.create({
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
        gid: crypto.randomUUID(),
        live: 'https://twitch.tv/impactium',
        prize: 50
      }
    }).then(console.log);
  }
};
