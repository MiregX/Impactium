import { PrismaService } from '@api/main/prisma/prisma.service';
import { teams_global_view } from '@api/main/redis/redis.dto';
import { RedisService } from '@api/main/redis/redis.service';
import { FtpService } from '@api/mcs/file/ftp.service';
import { CreateTeamDto, FindOneByIndent, TeamAlreadyExist, TeamCheckoutDto, UpdateTeamDto } from './team.dto';
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
    await this.findOneByIndent(indent, {
      throw: true,
    })

    const cdn = this.uploadBanner(indent, banner);

    return this.prisma.team.upsert({
      where: {
        indent,
      },
      create: {
        title: team.title,
        indent,
        banner: cdn,
        owner: {
          connect: {
            uid,
          }
        }
      },
      update: {
        title: team.title,
        banner: cdn,
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
    team: UpdateTeamDto,
    banner: Express.Multer.File
  ) {

    const cdn = this.uploadBanner(indent, banner);

    return this.prisma.team.upsert({
      where: {
        indent,
      },
      create: {
        title: team.title,
        indent,
        banner: cdn,
        owner: {
          connect: {
            uid
          }
        }
      },
      update: {
        title: team.title,
        banner: cdn,
        owner: {
          connect: {
            uid,
          }
        }
      }
    });
  }

  findManyByUid(uid: string): Promise<TeamEntity[]> {
    return this.prisma.team.findMany({
      where: {
        ownerId: uid
      }
    })
  }

  findOneByIndent(indent: string, params: FindOneByIndent) {
    const method = params.throw
      ? this.prisma.team.findUniqueOrThrow
      : this.prisma.team.findUnique;

    try {
      return method({
        where: {
          indent,
        }
      });
    } catch (_) {
      throw new TeamAlreadyExist();
    }
  }

  pagination(limit: number = 20, skip: number = 0) {
    const teams = this.redisService.hgetall(teams_global_view)

    return teams || this.prisma.team.findMany({
      take: limit,
      skip: skip,
    }).then((teams: TeamEntity[]) => {
      this.redisService.hset(teams_global_view)
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
