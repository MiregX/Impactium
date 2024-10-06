import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../api/src/prisma/prisma.service';
import { OnSeed } from '..';
import { teams } from './assets/teams.data';

@Injectable()
export class TeamsSeedService implements OnSeed {
  constructor(private readonly prisma: PrismaService) {}

  async seed(): Promise<void> {
    if (process.env.NODE_ENV === 'production') return;

    await this.prisma.team.createMany({
      skipDuplicates: true,
      data: teams,
    }).then(({ count }) => Logger.log(`${count} teams has been inserted successfully`, 'SEED'));
  };
};
