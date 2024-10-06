import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../api/src/prisma/prisma.service';
import { OnSeed } from '..';
import { tournament } from './assets/tournaments.data';

@Injectable()
export class TournamentsSeedService implements OnSeed {
  constructor(private readonly prisma: PrismaService) {}

  async seed(): Promise<void> {
    if (process.env.NODE_ENV === 'production') return;

    await this.prisma.tournament.upsert({
      where: { code: tournament.code },
      update: tournament,
      create: tournament
    }).then(() => Logger.log(`Tournament ${tournament.code} has been inserted successfully`, 'SEED'));
  };
};
