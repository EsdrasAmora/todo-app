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

//TODO: Check TrpcError and update this, maybe we could use trpc error directly?
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
  Database: 500,
  BadGateway: 502,
  UncaughtException: -1,
  Teardown: -1,
} as const;

export type ErrorType =
  | 'DataSource'
  | 'Forbidden'
  | 'InvalidData'
  | 'NotFound'
  | 'InternalServer'
  | 'Conflict'
  | 'Unauthorized'
  | 'BadGateway'
  | 'Database'
  | 'Teardown'
  | 'UncaughtException';
