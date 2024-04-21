import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client'
import { PrismaService } from '@api/main/prisma/prisma.service';
import { ReducedPlayerEntity } from './entities/player.entity';
import { PlayerAlreadyExists } from './dto/player.dto';

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
  
  async findManyByNicknames(nicknames: string[]) {
    return this.prisma.player.findMany({
      where: {
        nickname: {
          in: nicknames
        }
      },
      select: new ReducedPlayerEntity().selectFields()
    });
  }

  async setNickname(uid: string, nickname: string) {
    const isExists = await this.findOneByNickname(nickname);
    if (!!isExists) {
      throw new PlayerAlreadyExists()
    }
    return this.update(uid, {
      nickname
    });
  }

  setPassword(uid: string, password: string) {
    return this.update(uid, {
      password
    });
  }

  register(uid: string) {
    return this.update(uid, {
      register: Date.UTC.toString()
    });
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
