import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../api/src/prisma/prisma.service';
import { OnSeed } from '..';
import { blueprints } from './assets/blueprints.data';
import { λParam } from '@impactium/pattern';

@Injectable()
export class BlueprintSeedService implements OnSeed {
  constructor(private readonly prisma: PrismaService) {}

  async seed(): Promise<void> {
    await this.prisma.blueprint.createMany({
      skipDuplicates: true,
      data: Object.values(blueprints),
    }).then(({ count }) => Logger.log(`${count} blueprints has been inserted successfully`, 'SEED'));

    const admin = await this.prisma.user.findUnique({
      where: { uid: 'system' },
    });

    if (!admin) return;

    const inventory: λParam.Imprint[] = ['enchanted_obsidian', 'phoenix_feather', 'elven_dew', 'darkness_scroll', 'wind_crystal', 'light_crystal', 'apple', 'crab_claw', 'bone', 'bronze_ingot', 'gold_ingot'];

    await this.prisma.item.createMany({
      skipDuplicates: true,
      data: inventory.map((imprint) => ({
        uid: admin.uid,
        imprint,
        amount: imprint.includes('_') ? Math.round(Math.random() * 3) : 1,
      })),
    }).then(({ count }) => Logger.verbose(`${count} items has been added to admin's inventory successfully`, 'SEED'));
  };
};
