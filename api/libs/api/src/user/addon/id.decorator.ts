import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRequestDto } from './user.dto'

export const Id = createParamDecorator(
  async (_, context: ExecutionContext): Promise<UserRequestDto> => {
    return context.switchToHttp().getRequest().user?.uid;
  },
);