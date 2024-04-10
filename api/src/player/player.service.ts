import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/player.dto';
import { UpdatePlayerDto } from './dto/player.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlayerService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  findOneByIdOrCreate(uid: string) {
    return this.prisma.player.findUnique({
      where: {
        uid: uid
      }
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
