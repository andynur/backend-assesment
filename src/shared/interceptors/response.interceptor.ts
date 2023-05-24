import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { Observable, catchError, map, of } from 'rxjs';
import {
  FormattedResponseDto,
  MetaFormattedResponseDto,
  PaginationResponse,
} from '../dto';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(c: ExecutionContext, next: CallHandler): Observable<any> {
    if (c.getType() === 'http') {
      const req = c
        .switchToHttp()
        .getRequest<Request & { request_start: number }>();

      const res = c.switchToHttp().getResponse();

      if (req.headers.accept === 'text/event-stream') {
        return next.handle();
      }

      return next.handle().pipe(
        catchError((err) => {
          return of(err);
        }),
        map((it) => {
          if (!Array.isArray(it) && typeof it == 'object') {
            const respObject = this.handleResponseObject(it, req.request_start);
            res.status(respObject.meta.code);
            return respObject;
          }
          return;
        }),
      );
    }
    return next.handle().pipe();
  }

  handleResponseObject(it: any, startNumber: number) {
    const resp = new FormattedResponseDto();
    resp.meta = plainToInstance(MetaFormattedResponseDto, {
      success: true,
      code: 200,
      message: 'ok',
      response_time: new Date().getTime() - startNumber,
    } as Partial<MetaFormattedResponseDto>);

    if (it instanceof HttpException) {
      console.error(it);
      resp.meta.code = it.getStatus();
      resp.meta.message = it.message;
    } else if (it instanceof Error) {
      console.error(it);
      resp.meta.code = 500;
      resp.meta.message = 'error';
      resp.meta.success = false;
    }

    if (Reflect.has(it, 'data')) {
      resp.result = it.data;
    }
    if (Reflect.has(it, 'paginationMeta')) {
      if (it.paginationMeta instanceof PaginationResponse) {
        resp.meta.pagination = it.paginationMeta;
      }

      if (!resp.meta.pagination) {
        const pag = plainToInstance(PaginationResponse, it.paginationMeta);
        resp.meta.pagination = pag;
      }
    }

    return resp;
  }
}
