import { $Enums, Team } from '@prisma/client';
import { TeamMemberEntity } from './team.member.entity';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { TournamentEntity } from '@api/main/tournament/addon/tournament.entity';

export class TeamEntity implements Team {
  registered!: Date;
  logo!: string | null;
  indent!: string;
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

  static select = ({ members = false, owner = false, tournaments = false }: Options = {}) => ({
    logo: true,
    registered: true,
    indent: true,
    title: true,
    ownerId: true,
    description: true,
    joinable: true,
    members: members && {
      select: TeamMemberEntity.select({ user: true }),
    },
    owner: owner && {
      select: UserEntity.select()
    },
    tournaments: tournaments && {
      select: TournamentEntity.select()
    }
  });
}

interface Options {
  members?: boolean;
  owner?: boolean;
  tournaments?: boolean;
}