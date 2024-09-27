import { HttpStatus } from '@nestjs/common';
import { HttpException } from './http.exception';

export class UnauthorizedException extends HttpException {
  public static readonly ERROR_CODE_DEFAULT = 401000;
  public static readonly ERROR_CODE_LOGIN_REQUIRED = 401001;

  public static readonly ERROR_MESSAGE_DEFAULT = 'Unauthorized';
  public static readonly ERROR_MESSAGE_LOGIN_REQUIRED = 'User is not logged in';

  constructor(message: string, errorCode: number) {
    super(message, errorCode, HttpStatus.UNAUTHORIZED);
  }
}
