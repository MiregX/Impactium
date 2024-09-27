import { $Enums, TeamInvite } from '@prisma/client';
import { TeamMemberEntity } from './team.member.entity';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { TournamentEntity } from '@api/main/tournament/addon/tournament.entity';
import { TeamEntity } from './team.entity';

export class TeamInviteEntity implements TeamInvite {
  id!: string;
  created!: Date;
  indent!: string;
  used!: number;
  maxUses!: number;
  team?: TeamEntity;
}

export enum TeamInviteStatus {
  Valid = 'Valid',
  NotFound = 'NotFound',
  Expired = 'Expired',
  Used = 'Used'
}