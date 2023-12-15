import { LoggingWinston } from '@google-cloud/logging-winston';
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';

import { ReqStore } from '../context';
import { Env } from '../env';
import { AppError } from '../error';

type BaseLogParams = {
  method?: string;
  className?: string;
  extra?: object;
};

type LogParams = BaseLogParams &
  (
    | {
        level: 'error';
        error: AppError;
      }
    | { message: string; level: 'debug' | 'warn' | 'info' }
  );

export class Log {
  private static logger: WinstonLogger;
  private constructor() {}
  static {
    this.init();
    this.info('Logger initialized');
  }

  private static init(): void {
    this.logger = createLogger({
      level: Env.LOGGER_LEVEL,
      transports: Env.IS_RUNNIG_ON_CLOUD
        ? [new LoggingWinston({})]
        : [new transports.Console({ format: format.combine(format.simple(), format.colorize()) })],
    });
  }

  static info(message: string, input?: BaseLogParams): void {
    this.log({ ...input, message, level: 'info' });
  }

  static debug(message: string, input?: BaseLogParams): void {
    this.log({ ...input, message, level: 'debug' });
  }

  static warn(message: string, input?: BaseLogParams): void {
    this.log({ ...input, message, level: 'warn' });
  }

  static error(error: AppError, input?: BaseLogParams): void {
    this.log({ ...input, error, level: 'error' });
  }

  static log(input: LogParams): void {
    const context = ReqStore.getOptional();

    if ('error' in input) {
      const { error, ...info } = input;
      return void this.logger.log({
        ...context,
        ...info,
        //TODO: format this, consider doing a safe parse on it `AppError`
        message: JSON.stringify(error),
      });
    }

    return void this.logger.log({
      ...context,
      ...input,
    });
  }
}
