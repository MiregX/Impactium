import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TournamentStandart } from './addon/tournament.standart';
import { TournamentEntity } from './addon/tournament.entity';
import { addWeeks, addDays, getMonth } from 'date-fns';
import { UserEntity } from '../user/addon/user.entity';
import { TeamEntity } from '../team/addon/team.entity';
import { DAY, Grid, HOUR, PowerOfTwo, λCache, λIteration, λIterations, λParam } from '@impactium/pattern';
import { BattleEntity } from './addon/battle.entity';
import { λthrow } from '@impactium/utils';
import { CreateTournamentDto, UpdateTournamentDto } from './addon/tournament.dto';
import { FtpService } from '@api/mcs/file/ftp.service';
import { TournamentAlreadyExist, TournamentLimit } from '../application/addon/error';
import { Readable } from 'stream';
import { Logger } from '../application/addon/logger.service';

@Injectable()
export class TournamentService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ftpService: FtpService
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
          code: `battle-cup_${getMonth(friday) + 1}-${friday.getDate()}`,
        },
      }).then((battleCup) => {
        !battleCup && this.createBattleCup(friday);
      });
    }
  }

  delete(user: UserEntity, code: TournamentEntity['code']) {
    return this.prisma.tournament.delete({
      where: { code, ownerId: user.uid },
      include: {
        iterations: true
      }
    }).then(TournamentEntity.normalize);
  }
  
  async find(code: TournamentEntity['code']) {
    const tournament = await this.prisma.tournament.findUnique({
      ...TournamentEntity.select({ teams: true, owner: true, iterations: true }),
      where: { code }
    }).then(TournamentEntity.normalize);

    return TournamentEntity.fulfill(tournament);
  }

  findByUser = (uid: UserEntity['uid']) => this.prisma.tournament.findMany({
    ...TournamentEntity.select(),
    where: { ownerId: uid }
  });

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
    }).then(TournamentEntity.normalize);
  }

  async create(uid: λParam.Username, tournament: CreateTournamentDto, banner: Express.Multer.File) {
    await this.findByUser(uid).then(tournaments => {
      if (tournaments.length >= 3) λthrow(TournamentLimit);
    });

    await this.find(tournament.code).then(tournament => {
      if (tournament) λthrow(TournamentAlreadyExist);
    });

    const createdTournament = await this.prisma.tournament.create({
      data: {
        ...tournament,
        has_lower_bracket: tournament.has_lower_bracket === 'true',
        iterations: {},
        banner: await this.uploadBanner(tournament.code, banner),
        owner: {
          connect: {
            uid
          }
        },
        end: addDays(tournament.start, 1),
        description: tournament.description || '$tournament.default_description',
        rules: tournament.rules || '$tournament.default_rules',
      }
    }).then(TournamentEntity.normalize);

    if (!createdTournament) λthrow(InternalServerErrorException);

    const grid = await this.grid(createdTournament, tournament.iterations, tournament.has_lower_bracket === 'true', JSON.parse(tournament.settings));
  }

  update(uid: λParam.Username, tournament: UpdateTournamentDto, banner?: Express.Multer.File) {
    
  }

  async generateIteration(code: TournamentEntity['code']) {
    const teams = await this.prisma.team.findMany({
      where: {
        tournaments: {
          some: {
            code
          }
        }
      }
    });

    const last_iteration = await this.prisma.iteration.findFirst({
      where: { tid: code },
      orderBy: { n: 'desc' },
      select: {
        battles: true,
        n: true
      }
    });

    if (!last_iteration) λthrow(InternalServerErrorException);

    const n = last_iteration
      ? PowerOfTwo.prev(last_iteration.n as λIteration)
      : PowerOfTwo.next(teams.length);

    const brackets = TournamentEntity.new_iteration(n, last_iteration.battles);

    await this.prisma.iteration.createMany({
      data: brackets.map((bracket, i) => ({
        tid: code,
        n,
        is_lower_bracket: Boolean(i),
        best_of: 1,
        startsAt: new Date(),
        battles: {
          createMany: {
            data: bracket
          }
        }
      })),
    });
  }

  async insertTeam(code: TournamentEntity['code']) {
    const team = await this.prisma.team.findFirst({
      where: {
        tournaments: {
          none: {
            code
          }
        }
      }
    });

    if (!team) λthrow(InternalServerErrorException);

    return this.prisma.tournament.update({
      where: { code },
      data: {
        teams: {
          connect: {
            indent: team.indent
          }
        }
      },
      ...TournamentEntity.select({ teams: true })
    });
  }

  async processIteration(code: TournamentEntity['code']) {
    const iteration = await this.prisma.iteration.findFirst({
      where: { tid: code },
      select: {
        id: true,
        battles: true,
        n: true
      },
      orderBy: { n: 'desc' },
    });

    if (!iteration) λthrow(InternalServerErrorException);

    const battles = await Promise.all(iteration.battles.map(async battle => {
      return await this.prisma.battle.update({
        where: { id: battle.id },
        data: {
          is_slot_one_winner: battle.slot2 ? Math.random() > 0.5 : true,
          iid: iteration.id
        }
      });
    }));

    return battles;
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
    }).then(TournamentEntity.normalize);
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

  grid = async (tournament: TournamentEntity, iteration?: λIteration, lower: boolean = false, settings: Grid = {}) => {
    iteration = iteration ?? PowerOfTwo.next(tournament.teams?.length || 0);

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
          create: isFirstIteration && tournament.teams ? this.pairs(tournament.teams.map(team => team.indent)) : []
        },
        best_of: settings[iteration],
        n: iteration,
        startsAt: tournament.start
      }
    });

    if (iteration > 1) {
      this.grid(tournament, PowerOfTwo.prev(iteration), lower, settings);
    }

    Logger.log(`Generated grid for ${tournament.code}`, TournamentService.name);
  }

  private async uploadBanner(code: TournamentEntity['code'], banner: Express.Multer.File): Promise<string> {
    const stream = new Readable();
    stream.push(banner.buffer);
    stream.push(null);

    const extension = banner.originalname.split('.').pop();
    const { ftp, cdn } = TournamentEntity.getLogoPath(`${code}.${extension}`);
    await this.ftpService.uploadFile(ftp, stream);

    return cdn;
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
