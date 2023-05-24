import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { FormattedResponseDto, MetaFormattedResponseDto } from 'src/shared/dto';

@Catch()
export class GlobalFilter<T extends Error> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    console.error(exception);
    if (host.getType() === 'http') {
      const response = host.switchToHttp().getResponse<Response>();
      const request = host
        .switchToHttp()
        .getRequest<Request & { request_start: number }>();
      const resp = new FormattedResponseDto();
      resp.meta = plainToInstance(MetaFormattedResponseDto, {
        success: false,
        code: 500,
        message: 'error :' + exception.message,
        response_time: new Date().getTime() - request.request_start,
      } as Partial<MetaFormattedResponseDto>);
      if (exception instanceof HttpException) {
        resp.meta.code = exception.getStatus();
        resp.meta.message = exception.message;
      } else {
        resp.meta.code = 500;
        resp.meta.message = 'service unvelible';
      }
      return response.status(resp.meta.code).json(resp);
    }
    throw exception;
  }
}
