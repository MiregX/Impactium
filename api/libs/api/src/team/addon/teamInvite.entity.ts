import { $Enums, Prisma, TeamInvite } from '@prisma/client';
import { TeamEntity } from './team.entity';

export class TeamInviteEntity implements TeamInvite {  
  id!: string;
  created!: Date;
  indent!: string;
  used!: number;
  maxUses!: number;
  declines!: number;
  team?: TeamEntity;

  public static select = (): Prisma.TeamInviteDefaultArgs => ({
    select: {
      id: true,
      created: true,
      used: true,
      maxUses: true,
    }
  })
}
