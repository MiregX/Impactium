import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TournamentStandart } from './addon/tournament.standart';
import { TournamentEntity } from './addon/tournament.entity';
import { addWeeks, addDays, getMonth } from 'date-fns';
import { UserEntity } from '../user/addon/user.entity';
import { Logger } from '@nestjs/common';
import { TeamEntity } from '../team/addon/team.entity';
import { DAY, HOUR, PowerOfTwo, λIteration, λIterations } from '@impactium/pattern';
import { BattleEntity } from './addon/battle.entity';
import { λthrow } from '@impactium/utils';

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
    return await this.prisma.tournament.findMany({
      ...TournamentEntity.select({ teams: true, actual: true }),
      take: limit,
      skip: skip,
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

  delete(user: UserEntity, code: string) {
    return this.prisma.tournament.delete({
      where: { code, ownerId: user.uid },
      include: {
        iterations: true
      }
    });
  }
  
  async find(code: string) {
    return this.prisma.tournament.findUnique({
      ...TournamentEntity.select({ teams: true, owner: true, iterations: true }),
      where: { code }
    }).then(TournamentEntity.normalize);
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
      ...TournamentEntity.select({ teams: true })
    })
  }

  private timers: Map<TournamentEntity['code'], NodeJS.Timeout> = new Map();

  async upcoming() {
    const currentTime = new Date();
    const oneHourLater = new Date();
    oneHourLater.setHours(oneHourLater.getHours() + 1);

    return this.prisma.tournament.findMany({
      where: {
        start: {
          gte: currentTime,
          lte: oneHourLater,
        },
      },
      ...TournamentEntity.select({ teams: true })
    });
  }

  descheduler() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }

  async scheduler() {
    this.descheduler();
    const tournaments = await this.upcoming();

    tournaments.forEach(tournament => {
      const delay = new Date(tournament.start).getTime() - Date.now();

      const timerId = setTimeout(() => {
        this.grid(tournament);
      }, delay);

      this.timers.set(tournament.code, timerId);
      Logger.log(`Scheduled tournament ${tournament.code} to start in ${delay} ms`);
    });
  }

  pairs = (arr: Array<string | null>) => arr.reduce((acc, _, i, arr) => {
    if (i % 2 === 0) acc.push({
      slot1: arr[i]!, 
      slot2: arr[i + 1]
    });
    return acc;
  }, [] as Pick<BattleEntity, 'slot1' | 'slot2'>[]);

  grid = async (tournament: TournamentEntity, iteration?: λIteration, lower: boolean = false) => {
    if (!tournament.teams) λthrow(InternalServerErrorException);

    iteration = iteration ?? PowerOfTwo.next(tournament.teams.length);

    const exist = await this.prisma.iteration.findFirst({
      where: {
        tid: tournament.code,
        is_lower_bracket: lower,
        n: iteration / 2
      }
    });

    if (exist) {
      return;
    }

    const isFirstIteration = iteration === PowerOfTwo.next(tournament.teams?.length || 0);

    await this.prisma.iteration.create({
      data: {
        is_lower_bracket: lower,
        tid: tournament.code,
        battles: {
          create: isFirstIteration ? this.pairs(tournament.teams.map(team => team.indent)) : []
        },
        n: iteration,
        startsAt: tournament.start
      }
    });

    if (iteration > 1) {
      this.grid(tournament, PowerOfTwo.prev(iteration), lower);
    }

    Logger.log(`Generated grid for ${tournament.code}`, TournamentService.name);
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
        has_lower_bracket: true,
        iterations: {
          createMany: {
            data: [
              {
                n: λIterations._8,
                is_lower_bracket: false,
                startsAt: new Date(Date.now() + HOUR),
                best_of: 1
              },
              {
                n: λIterations._4,
                is_lower_bracket: false,
                startsAt: new Date(Date.now() + HOUR * 3)
              },
              {
                n: λIterations._4,
                is_lower_bracket: true,
                startsAt: new Date(Date.now() + HOUR * 3)
              },
              {
                n: λIterations._2,
                is_lower_bracket: false,
                best_of: 2,
                startsAt: new Date(Date.now() + DAY)
              },
              {
                n: λIterations._2,
                is_lower_bracket: true,
                best_of: 2,
                startsAt: new Date(Date.now() + DAY)
              },
              {
                n: λIterations._1,
                is_lower_bracket: false,
                best_of: 3,
                startsAt: new Date(Date.now() + DAY + HOUR * 3)
              },
            ]
          }
        }
      }
    }).then(tournament => Logger.log(tournament));
  }
};
