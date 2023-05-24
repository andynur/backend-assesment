import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class GlobalMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    // set request tracker
    req['request_start'] = new Date().getTime();

    // custom request logger
    res.on('finish', () => {
      const { method, originalUrl } = req;
      const { statusCode } = res;
      const message = `${statusCode} - ${method} ${originalUrl}`;

      if (statusCode >= 500) {
        return this.logger.error(message);
      }

      if (statusCode >= 400) {
        return this.logger.warn(message);
      }

      return this.logger.log(message);
    });

    next();
  }
}
