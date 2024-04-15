import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PlayerRequestDto } from './dto/player.dto'


export const Player = createParamDecorator(
  async (_, context: ExecutionContext): Promise<PlayerRequestDto> => {
    return context.switchToHttp().getRequest().player;
  },
);