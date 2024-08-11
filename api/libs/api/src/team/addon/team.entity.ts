import { Team } from '@prisma/client';
import { TeamMemberEntity } from './team.member.entity';

export class TeamEntity implements Team {
  registered: Date;
  logo: string;
  indent: string;
  title: string;
  description: string;
  ownerId: string;
  members?: TeamMemberEntity[];

  static getLogoPath(filename: string) {
    const ftp = `/public/uploads/${filename}`;
    return {
      ftp,
      cdn: 'https://cdn.impactium.fun' + ftp,
    };
  }

  static select = ({ members}: Options = {}) => ({
    logo: true,
    registered: true,
    indent: true,
    title: true,
    ownerId: true,
    description: true,
    members: members && {
      select: TeamMemberEntity.select({ user: true }),
    }
  });
}

interface Options {
  members?: boolean
}