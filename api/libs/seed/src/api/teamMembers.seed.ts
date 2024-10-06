import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../api/src/prisma/prisma.service';
import { OnSeed } from '..';
import { members } from './assets/teamMembers.data';

@Injectable()
export class TeamMembersSeedService implements OnSeed {
  constructor(private readonly prisma: PrismaService) {}

  async seed(): Promise<void> {
    if (process.env.NODE_ENV === 'production') return;

    const result = await Promise.all(members.map(async (member) => {
      const exist = await this.prisma.teamMember.count({
        where: { uid: member.uid, indent: member.indent }
      });

      if (exist > 0) return;

      return await this.prisma.teamMember.create({ data: member })
    }));

    Logger.log(`${result.filter(v => !!v).length} members has been inserted successfully`, 'SEED');
  };
};
