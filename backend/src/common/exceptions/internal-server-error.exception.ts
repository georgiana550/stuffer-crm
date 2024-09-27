import { HttpStatus } from '@nestjs/common';
import { HttpException } from './http.exception';

export class InternalServerErrorException extends HttpException {
    logError = true;

    public static readonly ERROR_CODE_DEFAULT = 500000;
    public static readonly ERROR_CODE_EXTERNAL_SERVICE_REQUEST_ERROR = 500001;

    public static readonly ERROR_MESSAGE_DEFAULT = 'Internal server error';
    public static readonly ERROR_MESSAGE_EXTERNAL_SERVICE_REQUEST_ERROR = 'External service error';

    constructor(message: string, errorCode: number, details?: Record<string, unknown> | string) {
        super(message, errorCode, HttpStatus.INTERNAL_SERVER_ERROR, details);
    }
}
