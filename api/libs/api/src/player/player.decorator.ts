import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Player = createParamDecorator(
  async (_, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().player;
  },
);