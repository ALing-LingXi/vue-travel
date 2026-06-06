import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, label, printf, colorize } = format;

const myFormat = printf(({ level, message, label, timestamp, ...meta }) => {
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} [${label}] ${level}: ${message}${metaStr}`;
});

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: 'logs/travel-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: combine(
    label({ label: 'travel-api' }),
    timestamp(),
    myFormat
  )
});

const consoleTransport = new transports.Console({
  format: combine(
    colorize(),
    label({ label: 'travel-api' }),
    timestamp(),
    myFormat
  )
});

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    label({ label: 'travel-api' }),
    timestamp(),
    myFormat
  ),
  transports: [
    dailyRotateFileTransport,
    consoleTransport
  ],
  exceptionHandlers: [
    dailyRotateFileTransport,
    consoleTransport
  ],
  rejectionHandlers: [
    dailyRotateFileTransport,
    consoleTransport
  ]
});

export const logRequest = (req, res, next) => {
  const start = Date.now();
  const { method, url, ip, headers } = req;
  
  logger.info(`Request: ${method} ${url} from ${ip}`, {
    method,
    url,
    ip,
    userAgent: headers['user-agent']
  });

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`Response: ${method} ${url} ${res.statusCode} in ${duration}ms`);
  });

  next();
};

export default logger;