import { UUID } from 'crypto';

export interface ResponseBase<T = any> {
  status: number;
  timestamp: Date;
  req_id: UUID;
  data: T;
}

export interface ResponseSuccess<T = any> extends ResponseBase<T> {};

export interface ResponseError extends ResponseBase<{
  statusCode: number;
  message: string
}> {};
