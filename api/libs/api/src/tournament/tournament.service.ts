import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TournamentStandart } from './addon/tournament.standart';
import { TournamentEntity, TournamentEntityWithTeams } from './addon/tournament.entity';
import { subDays, startOfDay, setMilliseconds, setSeconds, setMinutes, setHours, addWeeks, addDays, getMonth, getYear } from 'date-fns';

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
    const x = await this.prisma.tournament.findMany({
      ...TournamentEntity.selectWithTeams(),
      take: limit,
      skip: skip
    });
    return x
  }

  private async insertBattleCups() {
    const today = new Date();
    const dayOfWeek = today.getUTCDay();
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7;

    const firstFriday = subDays(startOfDay(today), -daysUntilFriday);

    const fridays = Array.from({ length: 4 }, (_, i) =>
      setMilliseconds(
        setSeconds(
          setMinutes(
            setHours(addWeeks(firstFriday, i), 20),
            0
          ),
          0
        ),
        0
      )
    );

    for (const friday of fridays) {
      await this.prisma.tournament.findFirst({
        where: {
          ownerId: 'system',
          start: friday,
        },
      }).then(async battleCup => {
        if (!battleCup) {
          await this.createBattleCup(friday);
        }
      })
    }
  }

  private async createBattleCup(date: Date) {
    const code = `battle-cup_${getMonth(date) + 1}-${date.getDate()}`;
    await this.prisma.tournament.create({
      data: {
        banner: 'https://cdn.impactium.fum/logo/battle_cup.png',
        title: `Friday Battle Cup ${getMonth(date) + 1}/${date.getDate()}`,
        start: date,
        end: addDays(date, 1),
        description: '$tournament.battle_cup_description',
        code,
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
    });
  }
};
