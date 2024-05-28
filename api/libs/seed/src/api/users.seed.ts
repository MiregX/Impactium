import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../api/src/prisma/prisma.service';
import { OnSeed } from '..';
import { users } from './assets/users.data';

@Injectable()
export class UsersSeedService implements OnSeed {
  constructor(private readonly prisma: PrismaService) {}

  async seed(): Promise<void> {
    if (parseInt(process.env.X) > 0) return;

    await this.prisma.user.createMany({
      skipDuplicates: true,
      data: users,
    });
  }
}
