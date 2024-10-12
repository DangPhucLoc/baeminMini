import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: Logger = new Logger(GlobalExceptionFilter.name)) { }

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const { status, message, errorResponse } = this.handleException(exception);

        this.logger.error({
            message: `${request.method} ${request.originalUrl}`,
            statusCode: status,
            error: message,
            stack: (exception instanceof Error) ? exception.stack : 'N/A',
        });

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.originalUrl,
            message,
            ...(errorResponse ? { errorResponse } : {}),
        });
    }

    // Handle different types of exceptions and return relevant data
    private handleException(exception: unknown): { status: number; message: string; errorResponse?: any } {
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errorResponse: any = null;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const response = exception.getResponse();

            if (typeof response === 'string') {
                message = response;
            } else if (typeof response === 'object' && response !== null) {
                message = (response as any).message || 'Unknown error';
                errorResponse = response;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        return { status, message, errorResponse };
    }
}
