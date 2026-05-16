import { Injectable, Logger, type NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const startedAt = Date.now();
    const requestId = randomUUID().slice(0, 8);
    const method = req.method;
    const url = req.originalUrl;
    const client = req.ip ?? req.socket.remoteAddress ?? 'unknown';

    this.logger.log(`[${requestId}] -> ${method} ${url} from ${client}`);

    res.on('finish', () => {
      const durationMs = Date.now() - startedAt;
      const contentLength = res.getHeader('content-length') ?? 0;

      this.logger.log(
        `[${requestId}] <- ${method} ${url} ${res.statusCode} ${durationMs}ms ${contentLength}b`,
      );
    });

    next();
  }
}
