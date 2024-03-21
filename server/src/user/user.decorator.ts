import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  async (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);