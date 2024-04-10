import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/player.dto';
import { UpdatePlayerDto } from './dto/player.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlayerEntity, ReducedPlayerEntity } from './entities/player.entity';

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
