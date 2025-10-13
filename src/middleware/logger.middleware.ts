import { createLogger, Logger } from '../debug/logger';
import { Request, Response, NextFunction } from 'express';

const requestLogger: Logger = createLogger('REQUEST_LOGGER');
const DIVIDER = '----------------------------------';

export const logger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const requestId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  requestLogger.info(DIVIDER);
  requestLogger.info('Request Received', {
    requestId,
    method: req.method,
    url: req.url,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    headers: req.headers,
    body: req.body,
  });

  let responseBody: any = null;
  let responseStatus = res.statusCode;

  const originalSend = res.send;
  res.send = function (body) {
    responseBody = body;
    return originalSend.call(this, body);
  };

  const originalJson = res.json;
  res.json = function (body) {
    responseBody = body;
    return originalJson.call(this, body);
  };

  const originalStatus = res.status;
  res.status = function (code) {
    responseStatus = code;
    return originalStatus.call(this, code);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;

    requestLogger.info('Response Sent', {
      requestId,
      statusCode: responseStatus,
      contentLength: res.get('Content-Length'),
      durationMs: duration,
      method: req.method,
      url: req.url,
      responseBody: typeof responseBody === 'string' || typeof responseBody === 'object'
        ? responseBody
        : String(responseBody),
    });

    requestLogger.info(DIVIDER);
  });

  next();
};