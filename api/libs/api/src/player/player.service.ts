import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client'
import { PrismaService } from '@api/main/prisma/prisma.service';

@Injectable()
export class PlayerService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  findOneById(uid: string) {
    return this.prisma.player.findUnique({
      where: {
        uid
      }
    })
  }

  async findManyByNickname(nickname: string) {
    return this.prisma.player.findMany({
      where: {
        nickname
      }
    });
  }
  
  async findManyByNicknames(nicknames: string[]) {
    return this.prisma.player.findMany({
      where: {
        nickname: {
          in: nicknames
        }
      }
    });
  }

  async setNickname(uid: string, nickname: string) {
    const response = await this.update(uid, {
      nickname
    });

    return response
  }

  private update(uid: string, data: Prisma.PlayerUpdateInput) {
    return this.prisma.player.update({
      where: {
        uid,
      },
      data
    })
  }
}
