import { HttpStatus } from '@nestjs/common';
import { HttpException } from './http.exception';

export class NotFoundException extends HttpException {
  public static readonly ERROR_CODE_DEFAULT = 404000;
  public static readonly ERROR_CODE_USER_NOT_FOUND = 404001;
  public static readonly ERROR_CODE_COURSE_NOT_FOUND = 404002;
  public static readonly ERROR_CODE_LEAD_NOT_FOUND = 404003;

  public static readonly ERROR_MESSAGE_DEFAULT = 'Not Found';
  public static readonly ERROR_MESSAGE_USER_NOT_FOUND = 'User not found';
  public static readonly ERROR_MESSAGE_COURSE_NOT_FOUND = 'Course not found';
  public static readonly ERROR_MESSAGE_LEAD_NOT_FOUND = 'Lead not found';

  constructor(message: string, errorCode: number) {
    super(message, errorCode, HttpStatus.NOT_FOUND);
  }
}
