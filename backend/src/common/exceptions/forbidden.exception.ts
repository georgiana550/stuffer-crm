import { HttpStatus } from '@nestjs/common';
import { HttpException } from './http.exception';

export class ForbiddenException extends HttpException {
  public static readonly ERROR_CODE_DEFAULT = 403000;

  public static readonly ERROR_MESSAGE_DEFAULT = 'Forbidden';

  constructor(message: string, errorCode: number) {
    super(message, errorCode, HttpStatus.FORBIDDEN);
  }
}
