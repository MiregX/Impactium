import { PrismaService } from '@api/main/prisma/prisma.service';
import { teams_global_view } from '@api/main/redis/redis.dto';
import { RedisService } from '@api/main/redis/redis.service';
import { FtpService } from '@api/mcs/ftp/ftp.service';
import { CreateTeamDto, TeamAlreadyExist } from './team.dto';
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
    uid: string,
    team: CreateTeamDto,
    banner: Express.Multer.File
  ) {
    const isExist = await this.prisma.team.findUnique({
      where: {
        indent: team.indent
      }
    });

    if (isExist) throw new TeamAlreadyExist();

    const stream = new Readable();
    stream.push(banner.buffer);
    stream.push(null);

    const { ftp, cdn } = TeamEntity.getLogoPath(team.indent, banner.mimetype);
    // TODO: Check validity of method

    await this.ftpService.uploadFrom(stream, ftp);

    return this.prisma.team.create({
      data: {
        title: team.title,
        indent: team.indent,
        banner: cdn,
        owner: {
          connect: {
            uid
          }
        }
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

  pagination(limit: number = 20, skip: number = 0) {
    const teams = this.redisService.hgetall(teams_global_view)

    return teams || this.prisma.team.findMany({
      take: limit,
      skip: skip,
    }).then((teams: TeamEntity[]) => {
      this.redisService.hset(teams_global_view)
    });
  }
}
