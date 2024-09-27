import { HttpStatus } from '@nestjs/common';
import { HttpException } from './http.exception';

export class ServiceUnavailableException extends HttpException {
    public static readonly ERROR_CODE_DEFAULT = 503000;

    public static readonly ERROR_MESSAGE_DEFAULT = 'Service Unavailable';

    constructor(message: string, errorCode: number) {
        super(message, errorCode, HttpStatus.SERVICE_UNAVAILABLE);
    }
}
