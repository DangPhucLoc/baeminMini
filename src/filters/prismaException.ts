import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(PrismaExceptionFilter.name);

    catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const { statusCode, message, details } = this.handlePrismaError(exception);

        // Log the error details
        this.logger.error(`Prisma Exception: ${message}`, JSON.stringify(details));

        // Respond to the client with a structured error response
        response.status(statusCode).json({
            statusCode,
            message,
            details,
            timestamp: new Date().toISOString(),
        });
    }

    // Method to handle different Prisma error codes and provide appropriate responses
    private handlePrismaError(exception: PrismaClientKnownRequestError) {
        let statusCode = HttpStatus.BAD_REQUEST;
        let message = 'Prisma Client Known Request Error';
        let details = {};

        switch (exception.code) {
            case 'P2025': // Record not found
                statusCode = HttpStatus.NOT_FOUND;
                message = 'Record not found';
                details = { description: 'The specified record does not exist.' };
                break;

            case 'P2002': // Unique constraint violation
                statusCode = HttpStatus.CONFLICT;
                message = 'Unique constraint violation';
                details = {
                    fields: (exception.meta as { target: string[] }).target,
                    description: 'A record with the same unique fields already exists.',
                };
                break;

            case 'P2003': // Foreign key violation
                statusCode = HttpStatus.CONFLICT;
                message = 'Foreign key violation';
                details = {
                    description: 'The action violates a foreign key constraint.',
                };
                break;

            case 'P2004': // Constraint violation
                statusCode = HttpStatus.CONFLICT;
                message = 'Constraint violation';
                details = {
                    description: 'The action violates a database constraint.',
                };
                break;

            case 'P2014': // Relation violation (cascade delete/update)
                statusCode = HttpStatus.CONFLICT;
                message = 'Relation violation';
                details = {
                    description: 'The action caused a relation violation (cascade delete or update).',
                };
                break;

            default:
                statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
                message = 'Unexpected Prisma Client Error';
                details = {
                    code: exception.code,
                    meta: exception.meta,
                    description: 'An unexpected error occurred while processing your request.',
                };
                break;
        }

        return { statusCode, message, details };
    }
}
