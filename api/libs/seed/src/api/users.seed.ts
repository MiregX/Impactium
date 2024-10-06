import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../api/src/prisma/prisma.service';
import { OnSeed } from '..';
import { users } from './assets/users.data';

@Injectable()
export class UsersSeedService implements OnSeed {
  constructor(private readonly prisma: PrismaService) {}

  async seed(): Promise<void> {
    if (process.env.NODE_ENV === 'production') return;

    await this.prisma.user.createMany({
      skipDuplicates: true,
      data: users,
    }).then(({ count }) => Logger.log(`${count} users has been inserted successfully`, 'SEED'));
  }
}
