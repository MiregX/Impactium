import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRequestDto } from './dto/user.dto'


export const User = createParamDecorator(
  async (_, context: ExecutionContext): Promise<UserRequestDto> => {
    return context.switchToHttp().getRequest().user;
  },
);