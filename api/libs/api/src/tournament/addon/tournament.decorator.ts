import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TournamentEntity } from './tournament.entity';

export const Tournament = createParamDecorator(
  async (_, context: ExecutionContext): Promise<TournamentEntity> => {
    return context.switchToHttp().getRequest().tournament;
  },
);