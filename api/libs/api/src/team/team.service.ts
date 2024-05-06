import { Injectable } from '@nestjs/common';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { CreateTeamDto, TeamAlreadyExist } from './team.dto';
import { TeamEntity } from './team.entity';
import { FtpService } from '@api/mcs/ftp/ftp.service';
import { Readable } from 'stream';

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ftpService: FtpService
  ) {}

  async create(uid: string, { 
    indent,
    title
  }: CreateTeamDto,
  banner: Express.Multer.File) {
    const isExist = await this.prisma.team.findUnique({
      where: {
        indent
      }
    });

    if (isExist) throw new TeamAlreadyExist();

    const path = `cdn.impactium.fun/uploads/${indent}`;
    const stream = new Readable();
    stream.push(banner.buffer);
    stream.push(null);
    await this.ftpService.uploadFrom(stream, `cdn.impactium.fun/uploads/${indent}`);

    return this.prisma.team.create({
      data: {
        title,
        indent,
        banner: path,
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
    return this.prisma.team.findMany({
      take: limit,
      skip: skip,
    });
  }
}
