import { applyDecorators } from '@nestjs/common';
import { ApiConflictResponse } from '@nestjs/swagger';
import { ResponseError } from './response.interface';

export function ApiResponseConflict(): MethodDecorator {
  return applyDecorators(ApiConflictResponse({ type: ResponseError }));
}