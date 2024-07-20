import { Type } from '@nestjs/common';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { UUID } from 'crypto';

export class ResponseBase<T = any> {
  @ApiProperty({ example: 200, description: 'HTTP status code' })
  status: number;

  @ApiProperty({ example: new Date().toISOString(), description: 'Timestamp of the response' })
  timestamp: Date;

  @ApiProperty({ example: crypto.randomUUID(), description: 'Request ID' })
  req_id: UUID;

  @ApiProperty({ description: 'Response data' })
  data: T;
}

export class ResponseSuccess<T = any> extends ResponseBase<T> {
  @ApiProperty({ description: 'Response data' })
  data: T;
}

export class ResponseError {
  @ApiProperty({ example: 409, description: 'HTTP status code' })
  status: number;

  @ApiProperty({ example: new Date().toISOString(), description: 'Timestamp of the response' })
  timestamp: Date;

  @ApiProperty({ example: crypto.randomUUID(), description: 'Request ID' })
  req_id: string;

  @ApiProperty({
    description: 'Error data',
    type: 'object',
    properties: {
      statusCode: { type: 'number', example: 409 },
      message: { type: 'string', example: 'error_key_message' },
    },
  })
  data: {
    statusCode: number;
    message: string;
  };
}
