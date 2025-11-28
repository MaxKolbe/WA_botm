import winston from 'winston';
import dotenv from 'dotenv';
dotenv.config()

const { combine, timestamp, json, errors, align } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info', //minimum log level
  format: combine(errors({ stack: true }), timestamp({format: 'YYYY-MM-DD hh:mm A', }), json(), align()), //log output format + timestamp
  transports: [new winston.transports.Console()], //output destination
});


export default logger;

// Log levels
/*{
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
}
*/

// How to log
/*
logger.info('Info message');
logger.error('Error message');
logger.log('infp', 'info message');
logger.log('error', 'Warning message');
*/