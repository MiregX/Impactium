import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../api/src/prisma/prisma.service';
import { OnSeed } from '..';
import { blueprints } from './assets/blueprints.data';

@Injectable()
export class BlueprintSeedService implements OnSeed {
  constructor(private readonly prisma: PrismaService) {}

  async seed(): Promise<void> {
    await this.prisma.blueprint.createMany({
      skipDuplicates: true,
      data: Object.values(blueprints),
    }).then(({ count }) => Logger.log(`${count} blueprints has been inserted successfully`, 'SEED'));
  };
};
