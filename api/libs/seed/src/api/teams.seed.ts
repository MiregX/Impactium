import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../api/src/prisma/prisma.service';
import { OnSeed } from '..';
import { teams } from './assets/teams.data';

@Injectable()
export class TeamsSeedService implements OnSeed {
  constructor(private readonly prisma: PrismaService) {}

  async seed(): Promise<void> {
    if (parseInt(process.env.X) > 0) return;

    await this.prisma.team.createMany({
      skipDuplicates: true,
      data: teams.map(team => team),
    });
  };
};
