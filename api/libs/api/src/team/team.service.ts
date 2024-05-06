import { Injectable } from '@nestjs/common';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { CreateTeamDto, TeamAlreadyExist } from './team.dto';
import { TeamEntity } from './team.entity';

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async create(uid: string, { 
    indent,
    banner,
    title
  }: CreateTeamDto) {
    const isExist = await this.prisma.team.findUnique({
      where: {
        indent
      }
    });

    if (isExist) throw new TeamAlreadyExist();

    return this.prisma.team.create({
      data: {
        title,
        indent,
        banner,
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
