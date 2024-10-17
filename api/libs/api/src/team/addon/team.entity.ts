import { $Enums, Prisma, Team } from '@prisma/client';
import { TeamMemberEntity } from './team.member.entity';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { TournamentEntity } from '@api/main/tournament/addon/tournament.entity';
import { TeamInviteEntity } from './teamInvite.entity';
import { λParam } from '@impactium/pattern';

export class TeamEntity implements Team {
  registered!: Date;
  logo!: string | null;
  indent!: λParam.Indent;
  title!: string | null;
  description!: string | null;
  ownerId!: string;
  members?: TeamMemberEntity[];
  joinable!: $Enums.Joinable;

  static getLogoPath(filename: string) {
    const ftp = `/public/uploads/${filename}`;
    return {
      ftp,
      cdn: 'https://cdn.impactium.fun' + ftp,
    };
  }

  public static select = ({ members = false, owner = false, tournaments = false, invites = false }: Options = {}): Prisma.TeamDefaultArgs => ({
    select: {
      logo: true,
      registered: true,
      indent: true,
      title: true,
      ownerId: true,
      description: true,
      joinable: true,
      members: members && TeamMemberEntity.select({ user: true }),
      owner: owner && UserEntity.select(),
      tournaments: tournaments && TournamentEntity.select(),
      invites: invites && TeamInviteEntity.select()
    }
  });
}

interface Options {
  members?: boolean;
  owner?: boolean;
  tournaments?: boolean;
  invites?: boolean;
}
