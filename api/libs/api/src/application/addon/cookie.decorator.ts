import type { Request } from 'express';  
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookie = createParamDecorator((key: string, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  return key ? request.cookies?.[key] || request.headers?.[key] : request.cookies;
});