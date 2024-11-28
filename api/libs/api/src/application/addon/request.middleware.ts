import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    req['custom'] = {
      initialized: Date.now(),
      req_id: typeof req.headers['req_id'] === 'string'
        ? req.headers['req_id']
        : randomUUID(),
    };
    next();
  }
}
