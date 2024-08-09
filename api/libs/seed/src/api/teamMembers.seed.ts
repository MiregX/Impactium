import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../api/src/prisma/prisma.service';
import { OnSeed } from '..';
import { members } from './assets/teamMembers.data';

@Injectable()
export class TeamMembersSeedService implements OnSeed {
  constructor(private readonly prisma: PrismaService) {}

  async seed(): Promise<void> {
    if (parseInt(process.env.X) > 0) return;

    await this.prisma.teamMember.createMany({
      skipDuplicates: true,
      data: members,
    });
  };
};
