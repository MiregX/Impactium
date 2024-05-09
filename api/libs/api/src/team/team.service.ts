import { PrismaService } from '@api/main/prisma/prisma.service';
import { teams_global_view } from '@api/main/redis/redis.dto';
import { RedisService } from '@api/main/redis/redis.service';
import { FtpService } from '@api/mcs/file/ftp.service';
import { TeamStandarts, TeamAlreadyExist, TeamCheckoutDto, TeamLimitException, UpdateTeamDto } from './team.dto';
import { TeamEntity } from './team.entity';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ftpService: FtpService,
    private readonly redisService: RedisService
  ) {}

  async create(
    { indent, uid }: TeamCheckoutDto,
    team: UpdateTeamDto,
    banner: Express.Multer.File
  ) {
    // LIMIT MAX 3 CREATED TEAMS PER USER 
    await this.findManyByUid(uid)
      .then(teams => {
        teams.length >= 3 && (() => {throw new TeamLimitException()});
      })

    try {
      return this.prisma.team.create({
        data: {
          title: team.title,
          indent,
          logo: banner && this.uploadBanner(indent, banner),
          owner: {
            connect: {
              uid,
            }
          }
        }
      });
    } catch (error) {
      // Unique @indent issue 
      throw new TeamAlreadyExist();
    }
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

  setBanner(indent: string, banner: Express.Multer.File) {
    return this.prisma.team.update({
      where: {
        indent
      },
      data: {
        logo: banner && this.uploadBanner(indent, banner)
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

  pagination(
    limit: number = TeamStandarts.DEFAULT_PAGINATION_LIMIT,
    skip: number = TeamStandarts.DEFAULT_PAGINATION_PAGE,
  ) {
    const teams = this.redisService.hgetall(teams_global_view)

    return this.prisma.team.findMany({
      take: limit,
      skip: skip,
    });
  }

  private uploadBanner(indent: string, banner: Express.Multer.File) {
    const stream = new Readable();
    stream.push(banner.buffer);
    stream.push(null);
    
    const { ftp, cdn } = TeamEntity.getLogoPath(indent, banner.mimetype);
    this.ftpService.uploadFrom(stream, ftp);

    return cdn;
  }
}
