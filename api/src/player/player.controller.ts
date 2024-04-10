import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PlayerService } from './player.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Player } from './player.decorator';
import { PlayerEntity } from './entities/player.entity';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}
  
  @Get('get')
  async findOneByNickname(@Player() player: PlayerEntity) {
    const requestedPlayer = await this.playerService.findOneByNickname(player.id);
    return requestedPlayer
  }
  
  @Get('get')
  @UseGuards(AuthGuard)
  findOneById(@Player() player: PlayerEntity) {
    return this.playerService.findOneById(player.id);
  }

  @Post('register')
  @UseGuards(AuthGuard)
  register(@Player() player: PlayerEntity) {
    return this.playerService.register(player.id);
  }

}
