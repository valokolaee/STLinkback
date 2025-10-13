// src/debug/logger.ts
import winston from 'winston';
import path from 'path';

// Flags from environment variables
const FILE_LOG_ENABLED = true;
const CONSOLE_LOG_ENABLED = false;

// Create a logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),

  ),
  transports: [
    // File transport
    ...(FILE_LOG_ENABLED
      ? [
          new winston.transports.File({
            filename: path.join(__dirname, '../logs/all-logs.log'),
            level: 'info',
          }),
        ]
      : []),

    // Console transport
    ...(CONSOLE_LOG_ENABLED
      ? [
          new winston.transports.Console({
            format: winston.format.simple(),
          }),
        ]
      : []),
  ],
});

// Define a type for the logger
export type Logger = winston.Logger;

export default logger;

export const createLogger = (label: string): Logger => {
  return logger.child({ label });
};