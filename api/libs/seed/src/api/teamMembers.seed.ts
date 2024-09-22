import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../api/src/prisma/prisma.service';
import { OnSeed } from '..';
import { members } from './assets/teamMembers.data';

@Injectable()
export class TeamMembersSeedService implements OnSeed {
  constructor(private readonly prisma: PrismaService) {}

  async seed(): Promise<void> {
    if (process.env.NODE_ENV === 'production') return;

    await this.prisma.teamMember.createMany({
      skipDuplicates: true,
      data: members,
    });
  };
};
