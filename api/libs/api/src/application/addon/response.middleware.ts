import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ResponseMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const _json = res.json;

    res.json = function(body) {
      let data;
      try {
        data = JSON.parse(body);
      } catch (error) {
        data = body;
      }

      return _json.call(res, {
        timestamp: Date.now(),
        req_id: req['custom']?.req_id || '',
        status: res.statusCode,
        data,
      });
    };

    next();
  }
}
