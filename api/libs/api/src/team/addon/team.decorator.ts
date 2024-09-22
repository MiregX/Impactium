import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TeamEntity } from './team.entity';


export const Team = createParamDecorator(
  async (_, context: ExecutionContext): Promise<TeamEntity> => {
    return context.switchToHttp().getRequest().team;
  },
);