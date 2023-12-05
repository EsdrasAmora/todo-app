const AppErrorToken = Symbol('app.symbol.error');

export class AppError extends Error {
  [AppErrorToken] = true;
  code: ErrorType;
  statusCode: (typeof StatusCode)[keyof typeof StatusCode];

  constructor(type: ErrorType, message: string, cause?: Error) {
    super(message, { cause });

    this.code = type;
    this.statusCode = StatusCode[type];
  }
}

export function isAppError(error: any): error is AppError {
  return error?.[AppErrorToken] ?? false;
}

//TODO: check trpc error and update this, maybe we could use trpc error directly?
export const StatusCode = {
  Success: 200,
  BadRequest: 400,
  InvalidData: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  Conflict: 409,
  InternalServer: 500,
  DataSource: 500,
  BadGateway: 502,
} as const;

export type ErrorType =
  | 'DataSource'
  | 'Forbidden'
  | 'InvalidData'
  | 'NotFound'
  | 'InternalServer'
  | 'Conflict'
  | 'Unauthorized'
  | 'BadGateway';
