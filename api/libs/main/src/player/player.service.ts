import { Injectable } from '@nestjs/common';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { ReducedPlayerEntity } from './entities/player.entity';

@Injectable()
export class PlayerService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  findOneByIdOrCreate(uid: string) {
    return this.prisma.player.upsert({
      where: {
        uid
      },
      update: {},
      create: {
        uid
      },
    });
  }

  findOneById(uid: string) {
    return this.prisma.player.findUnique({
      where: {
        uid
      }
    })
  }

  async findOneByNickname(nickname: string) {
    return this.prisma.player.findUnique({
      where: {
        nickname
      },
      select: new ReducedPlayerEntity().selectFields()
    });
  }

  
  async findManyByNicknames(nickname: string[]) {
    return this.prisma.player.findMany({
      where: {
        nickname: {
          in: nickname
        }
      },
      select: new ReducedPlayerEntity().selectFields()
    });
  }
  

  register(uid: string) {
    return this.prisma.player.update({
      where: {
        uid,
      },
      data: {
        register: Date.UTC.toString()
      }
    })
  }
}
