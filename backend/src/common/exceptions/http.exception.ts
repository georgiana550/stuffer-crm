import { HttpException as NestHttpException } from '@nestjs/common';

export abstract class HttpException extends NestHttpException {
  protected readonly errorCode: number;
  protected readonly details?: Record<string, unknown> | string;
  protected readonly logError: boolean = false;

  constructor(
    message: string,
    errorCode: number,
    statusCode: number,
    details?: Record<string, unknown> | string,
  ) {
    super(message, statusCode);

    this.errorCode = errorCode;
    this.details = details;
  }

  public getErrorCode(): number {
    return this.errorCode;
  }

  public getErrorDetails(): Record<string, unknown> | string | undefined {
    return this.details;
  }

  public shouldLog(): boolean {
    return this.logError;
  }
}
