import { Controller, Get, Post, Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { PlayerService } from './player.service';
import { Player } from './player.decorator';
import { PlayerEntity } from './entities/player.entity';
import { PlayerGuard } from './player.guard';
import { FindPlayersDto, PlayerAlreadyExists, PlayerHaveSameNickname, SetNicknameDto, SetPasswordDto } from './dto/player.dto';

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
      return this.playerService.findOneByNickname(body.nickname);
    } else if ('nicknames' in body) {
      return this.playerService.findManyByNicknames(body.nicknames);
    }
  }
  
  @Post('register')
  @UseGuards(PlayerGuard)
  register(@Player() player: PlayerEntity) {
    return player.register ? player : this.playerService.register(player.uid);
  }

  @Post('set/nickname')
  @UseGuards(PlayerGuard)
  setNickname(@Body() body: SetNicknameDto, @Player() player: PlayerEntity) {
    if (player.nickname === body.nickname) throw new PlayerHaveSameNickname;
    return this.playerService.setNickname(player.uid, body.nickname);
  }

  @Post('set/password')
  @UseGuards(PlayerGuard)
  setPassword(@Body() body: SetPasswordDto, @Player() player: PlayerEntity) {
    return this.playerService.setPassword(player.uid, body.password);
  }
}
