import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto, UpdatePlayerDto } from './dto/player.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}
  
  @Get()
  @UseGuards(AuthGuard)
  findOneByUserId(@User() user: UserEntity) {
    return this.playerService.findOneByUserId(user.id)
  }

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(createPlayerDto);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playerService.update(+id, updatePlayerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playerService.remove(+id);
  }
}
