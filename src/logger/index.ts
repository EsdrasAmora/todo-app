import { Logger as WinstonLogger, createLogger, format, transports } from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { Env } from '../env';
import { ReqStore } from '../context';
import { AppError } from '../error';

export type AppLayer = 'Core' | 'Api' | 'Domain' | 'Data';

type BaseLogParams = {
  layer: AppLayer;
  method: string;
  className: string;
  payload?: object;
  message?: string;
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

  static init(): void {
    this.logger = createLogger({
      level: Env.LOGGER_LEVEL,
      transports: Env.IS_RUNNIG_ON_CLOUD
        ? [new LoggingWinston({})]
        : [new transports.Console({ format: format.json() })],
    });
  }

  static log(input: LogParams): void {
    const context = ReqStore.getOptional();

    if ('error' in input) {
      const { error, ...info } = input;
      return void this.logger.log({
        ...context,
        ...info,
        //TODO: format this
        message: JSON.stringify(error),
      });
    }

    return void this.logger.log({
      ...context,
      ...input,
      message: `[${input.layer}] [${input.className ?? 'global'}.${input.method}] [${input.message}]`,
    });
  }
}
