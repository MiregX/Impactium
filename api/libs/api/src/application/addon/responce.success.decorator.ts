import { applyDecorators, Type } from '@nestjs/common';
import { ApiCreatedResponse, ApiProperty } from '@nestjs/swagger';
import { ResponseSuccess } from './response.interface';

export function ApiResponseSuccess<T extends string | Function | Type<unknown> | [Function] | Record<string, any> | undefined>(type: T): MethodDecorator {
  return applyDecorators(
    ApiCreatedResponse({
      type: () => {
        class ResponseWithType extends ResponseSuccess<T> {
          @ApiProperty({ type: type })
          data!: T;
        }
        return ResponseWithType;
      },
    }),
  );
}
