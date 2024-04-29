import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client'
import { PrismaService } from '@api/main/prisma/prisma.service';
import { ReducedPlayerEntity } from './entities/player.entity';
import { PlayerAlreadyExists } from './dto/player.dto';
import { ConsoleService } from '@api/mcs/console/console.service';

@Injectable()
export class PlayerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly consoleService: ConsoleService,
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

  async getAllPlayersNicknames(): Promise<string[]> {
    const players = await this.prisma.player.findMany({
      select: {
        nickname: true
      }
    });
  
    return players.map(player => player.nickname);
  }

  async setNickname(uid: string, nickname: string) {
    const isExists = await this.findOneByNickname(nickname);
    if (!!isExists) {
      throw new PlayerAlreadyExists()
    }

    const response = await this.update(uid, {
      nickname
    });

    this.sync(response);

    return response
  }

  async setPassword(uid: string, password: string) {
    const response = await this.update(uid, {
      password
    });

    this.sync(response)

    return response
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
  
  private sync({ nickname, password }: { nickname: string, password: string }) {
    if (!!nickname && !!password) {
      this.consoleService.command(`authme register ${nickname} ${password}`)
      this.consoleService.command(`authme changepassword ${nickname} ${password}`)
      this.consoleService.syncWhitelist();
    }
  }
}
