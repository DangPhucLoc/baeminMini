import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    data: T;
    message: string;
    timestamp: number;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    constructor(private readonly message: string = 'Operation successful') { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        const now = Date.now();

        return next.handle().pipe(
            map((data) => ({
                data: data ?? {},
                message: this.message,
                timestamp: now,
            })),
        );
    }
}
