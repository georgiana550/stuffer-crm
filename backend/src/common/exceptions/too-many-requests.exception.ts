import { HttpStatus } from '@nestjs/common';
import { HttpException } from './http.exception';

export class TooManyRequestsException extends HttpException {
    public static readonly ERROR_CODE_DEFAULT = 429000;
    public static readonly ERROR_CODE_IP_LIMIT = 429002;
    public static readonly ERROR_CODE_USER_LIMIT = 429003;

    public static readonly ERROR_MESSAGE_DEFAULT = 'Too Many Requests';

    constructor(message: string, errorCode: number) {
        super(message, errorCode, HttpStatus.TOO_MANY_REQUESTS);
    }
}
