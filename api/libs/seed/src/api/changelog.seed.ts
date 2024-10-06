import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../api/src/prisma/prisma.service';
import { OnSeed } from '..';
import { changelogs } from './assets/changelog.data';

@Injectable()
export class ChangelogsSeedService implements OnSeed {
  constructor(private readonly prisma: PrismaService) {}

  async seed(): Promise<void> {
    await this.prisma.changelog.createMany({
      skipDuplicates: true,
      data: changelogs.map(changelog => ({
        ...changelog,
        on: new Date(changelog.on).toISOString()
      })),
    }).then(({ count }) => Logger.log(`${count} changelogs has been inserted successfully`, 'SEED'));
  };
};
