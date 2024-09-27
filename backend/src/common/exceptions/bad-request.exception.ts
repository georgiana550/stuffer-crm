import { HttpStatus } from '@nestjs/common';
import { HttpException } from './http.exception';

export class BadRequestException extends HttpException {
  public static readonly ERROR_CODE_DEFAULT = 400000;
  public static readonly ERROR_CODE_DUPLICATE_USER = 400001;
  public static readonly ERROR_CODE_INVALID_CREDENTIALS = 400002;
  public static readonly ERROR_CODE_DUPLICATE_LEAD_EMAIL = 400003;
  public static readonly ERROR_CODE_INVALID_ASSIGNE = 400004;
  public static readonly ERROR_CODE_DUPLICATE_LEAD_PHONE = 400005;

  public static readonly ERROR_MESSAGE_DEFAULT = 'Bad Request';
  public static readonly ERROR_MESSAGE_DUPLICATE_USER =
    'User with this email or phone number already exists';
  public static readonly ERROR_MESSAGE_INVALID_CREDENTIALS =
    'Password or email are not correct';
  public static readonly ERROR_MESSAGE_DUPLICATE_LEAD_EMAIL =
    'Lead with this email already exists, maybe is not assigned to you';
  public static readonly ERROR_MESSAGE_DUPLICATE_LEAD_PHONE =
    'Lead with this phone already exists, maybe is not assigned to you';
  public static readonly ERROR_MESSAGE_INVALID_ASSIGNE =
    'This lead is not assigned to you';

  constructor(message: string, errorCode: number) {
    super(message, errorCode, HttpStatus.BAD_REQUEST);
  }
}
