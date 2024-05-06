import { Controller, Get, Post, Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { PlayerService } from './player.service';
import { Player } from './player.decorator';
import { PlayerEntity } from './player.entity';
import { PlayerGuard } from './player.guard';
import { FindPlayersDto } from './player.dto';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}
  
  @Get('get')
  @UseGuards(PlayerGuard)
  get(@Player() player: PlayerEntity) {
    return player;
  }

  @Get('find')
  find(@Body() body: FindPlayersDto) {
    if ('nickname' in body) {
      return this.playerService.findManyByNickname(body.nickname);
    } else if ('nicknames' in body) {
      return this.playerService.findManyByNicknames(body.nicknames);
    }
  }
}