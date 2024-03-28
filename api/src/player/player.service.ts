import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/player.dto';
import { UpdatePlayerDto } from './dto/player.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlayerService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}
  findOneByUserId(id: string) {
    this.prisma
  }
  create(createPlayerDto: CreatePlayerDto) {
    return 'This action adds a new player';
  }

  findAll() {
    return `This action returns all player`;
  }

  findOne(id: number) {
    return `This action returns a #${id} player`;
  }

  update(id: number, updatePlayerDto: UpdatePlayerDto) {
    return `This action updates a #${id} player`;
  }

  remove(id: number) {
    return `This action removes a #${id} player`;
  }
}
