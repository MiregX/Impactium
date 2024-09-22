import { PrismaService } from '@api/main/prisma/prisma.service';
import { RedisService } from '@api/main/redis/redis.service';
import { FtpService } from '@api/mcs/file/ftp.service';
import { Checkout, CreateTeamDto, UpdateTeamDto, UpdateTeamMemberRoleDto } from './addon/team.dto';
import { TeamEntity } from './addon/team.entity';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { TeamStandart } from './addon/team.standart';
import { TeamAlreadyExist, TeamLimitException, TeamMemberRoleExistException } from '../application/addon/error';
import { UserEntity } from '../user/addon/user.entity';
import { λthrow } from '@impactium/utils';
import { TeamMember } from '@prisma/client';

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ftpService: FtpService,
    private readonly redisService: RedisService
  ) {}

  async create(
    { indent, uid }: Checkout,
    team: CreateTeamDto,
    banner?: Express.Multer.File
  ) {
    await this.findManyByUid(uid)
      .then(teams => {
        if (teams.length >= 3) throw new TeamLimitException();
      })
    
    await this.findOneByIndent(indent).then(team => {
      if (team) throw new TeamAlreadyExist();
    });

    return this.prisma.team.create({
      data: {
        title: team.title,
        indent,
        logo: banner && await this.uploadBanner(indent, banner),
        owner: {
          connect: {
            uid,
          }
        }
      }
    });
  }

  async update(
    indent: string,
    team: UpdateTeamDto,
    banner: Express.Multer.File
  ) {
    if (banner) {
      return this.setBanner(indent, banner)
    }
    return this.prisma.team.update({
      where: {
        indent,
      },
      data: {
        title: team.title
      }
    });
  }
  
  delete(user: UserEntity, indent: string) {
    return this.prisma.team.delete({
      where: { indent, ownerId: user.uid }
    })
  }

  async setBanner(indent: string, banner: Express.Multer.File) {
    return this.prisma.team.update({
      where: {
        indent
      },
      data: {
        logo: banner && await this.uploadBanner(indent, banner)
      }
    })
  }

  findManyByUid(uid: string): Promise<TeamEntity[]> {
    return this.prisma.team.findMany({
      where: {
        ownerId: uid
      }
    })
  }

  findOneByIndent(indent: TeamEntity['indent']) {
    return this.prisma.team.findUnique({
      select: TeamEntity.select({ members: true, owner: true, tournaments: true }),
      where: {
        indent,
      },
    });
  }
  
  findManyByTitleOrIndent(value: NonNullable<TeamEntity['indent'] | TeamEntity['title']>) {
    return this.prisma.team.findMany({
      where: {
        OR: [
          { title: { contains: value } },
          { indent: { contains: value.toLowerCase() } }
        ]
      },
      select: TeamEntity.select({ members: true }),
      take: TeamStandart.DEFAULT_PAGINATION_LIMIT
    });
  }
  
  async pagination(
    limit: number = TeamStandart.DEFAULT_PAGINATION_LIMIT,
    skip: number = TeamStandart.DEFAULT_PAGINATION_PAGE,
  ): Promise<TeamEntity[]> {
    return this.prisma.team.findMany({
      select: TeamEntity.select({ members: true }),
      take: limit,
      skip: skip,
    });
  }

  async setMemberRole(team: TeamEntity, { id, role }: UpdateTeamMemberRoleDto) {
    const isMemberWithExactRoleExist = team.members
      ? team.members.some(member => member.id !== id && member.role === role)
      : await this.prisma.teamMember.findMany({
          where: { team: { indent: team.indent } },
          select: {
            role: true
          }
        }).then(members => members.some(member => member.role === role));

    if (isMemberWithExactRoleExist) λthrow(TeamMemberRoleExistException);

    return await this.prisma.teamMember.update({
      where: {
        id,
        team: { indent: team.indent }
      },
      data: { role }
    })
  }
  
  kickMember(team: TeamEntity, id: TeamMember['id']) {
    return this.prisma.teamMember.delete({
      where: { id, team: { indent: team.indent } }
    });
  }

  private async uploadBanner(indent: TeamEntity['indent'], banner: Express.Multer.File) {
    const stream = new Readable();
    stream.push(banner.buffer);
    stream.push(null);

    const extension = banner.originalname.split('.').pop();
    const { ftp, cdn } = TeamEntity.getLogoPath(`${indent}.${extension}`);
    await this.ftpService.uploadFile(ftp, stream);

    return cdn;
  }
}
