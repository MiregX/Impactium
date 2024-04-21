import { Controller, Get, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { PlayerService } from './player.service';
import { Player } from './player.decorator';
import { PlayerEntity } from './entities/player.entity';
import { GetPlayerGuard, PlayerGuard } from './player.guard';
import { FindPlayers } from './dto/player.dto';
import { AuthGuard } from '@api/main/auth/auth.guard';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}
  
  @Get('get')
  @UseGuards(AuthGuard, GetPlayerGuard)
  find(@Body() body: FindPlayers, @Player() player: PlayerEntity) {
    console.log('Прилетел запрос')
    if (!body.nickname) {
      return player;
    }
  
    if (typeof body.nickname === 'string' || (Array.isArray(body.nickname) && body.nickname.length === 1)) {
      return this.playerService.findOneByNickname(
        Array.isArray(body.nickname)
          ? body.nickname[0]
          : body.nickname);
    }
  
    if (Array.isArray(body.nickname)) {
      return this.playerService.findManyByNicknames(body.nickname);
    }
  
    throw new BadRequestException();
  }

  @Post('register')
  @UseGuards(PlayerGuard)
  register(@Player() player: PlayerEntity) {
    return player.register ? player : this.playerService.register(player.uid);
  }
}
