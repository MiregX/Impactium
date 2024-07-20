import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiProperty } from '@nestjs/swagger';
import { ResponseSuccess } from './response.interface';

export function ApiResponseSuccess<T>(type: T): MethodDecorator {
  return applyDecorators(
    ApiCreatedResponse({
      type: () => {
        class ResponseWithType extends ResponseSuccess<T> {
          @ApiProperty({ type: type })
          data: T;
        }
        return ResponseWithType;
      },
    }),
  );
}
