import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ResponseMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const _json = res.json.bind(res);
    const _send = res.send.bind(res);
    const _redirect = res.redirect.bind(res);
    
    const wrap = (body: any) => {
      const data = (() => { try { return JSON.parse(body) } catch (_) { return body } })();
      res.setHeader('Content-Type', 'application/json');
      res.locals.wrapped = true;

      return {
        timestamp: Date.now(),
        req_id: req['custom']?.req_id || '',
        status: res.statusCode,
        data,
      };
    };

    res.json = (body) => _json(wrap(body));
    res.send = (body) => _send(res.locals.wrapped || res.locals.redirecting ? body : JSON.stringify(wrap(body)));
    res.redirect = (url: string | number, status: string | number = 302) => {
      res.locals.redirecting = true;
      return _redirect(
        typeof status === 'number' ? status : url as unknown as any,
        typeof url === 'number' ? status : url as unknown as any,
      );
    };

    next();
  }
}
