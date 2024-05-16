import { PrismaService } from '@api/main/prisma/prisma.service';
import { teams_global_view } from '@api/main/redis/redis.dto';
import { RedisService } from '@api/main/redis/redis.service';
import { FtpService } from '@api/mcs/file/ftp.service';
import { TeamStandarts, TeamAlreadyExist, TeamCheckoutDto, TeamLimitException, UpdateTeamDto, CreateTeamDto } from './addon/team.dto';
import { TeamEntity, TeamEntity_ComposedWithMembers } from './addon/team.entity';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { FTPUploadError } from '@api/mcs/file/addon/file.error';

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ftpService: FtpService,
    private readonly redisService: RedisService
  ) {}

  async create(
    { indent, uid }: TeamCheckoutDto,
    team: CreateTeamDto,
    banner: Express.Multer.File
  ) {
    await this.findManyByUid(uid)
      .then(teams => {
        teams.length >= 3 && (() => {throw new TeamLimitException()});
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
    { indent, uid }: TeamCheckoutDto,
    team: UpdateTeamDto
  ) {
    return this.prisma.team.update({
      where: {
        indent,
      },
      data: {
        title: team.title,
        owner: {
          connect: {
            uid,
          }
        }
      }
    });
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

  findOneByIndent(indent: string) {
    return this.prisma.team.findUnique({
      where: {
        indent,
      }
    });
  }
  
  async pagination(
    limit: number = TeamStandarts.DEFAULT_PAGINATION_LIMIT,
    skip: number = TeamStandarts.DEFAULT_PAGINATION_PAGE,
  ): Promise<TeamEntity_ComposedWithMembers[]> {
    return this.prisma.team.findMany({
      select: {
        indent: true,
        logo: true,
        title: true,
        ownerId: true,
        description: true,
        membersAmount: true,
        members: {
          select: {
            uid: true,
            roles: true,
            user: {
              select: {
                logins: {
                  orderBy: {
                    on: 'desc'
                  },
                  take: 1,
                  select: {
                    avatar: true
                  }
                }
              }
            }
          }
        }
      },
      take: limit,
      skip: skip,
    }).then(response => response.map(team => ({
      ...team,
      members: team.members.map(member => ({
        ...member,
        avatar: member.user.logins[0]?.avatar || '',
        user: undefined
      }))
    })));
  }
  
  

  private async uploadBanner(indent: string, banner: Express.Multer.File) {
    const stream = new Readable();
    stream.push(banner.buffer);
    stream.push(null);

    const extension = banner.originalname.split('.').pop();
    const { ftp, cdn } = TeamEntity.getLogoPath(`${indent}.${extension}`);
    await this.ftpService.uploadFile(ftp, stream);

    return cdn;
  }
}
