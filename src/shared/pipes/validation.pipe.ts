import {
  BadRequestException,
  ValidationPipeOptions as BaseOption,
  ValidationPipe as BasePipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
type ValidationPipeOptions = Omit<BaseOption, 'exceptionFactory'>;
export function ValidationPipe(params?: ValidationPipeOptions) {
  return new BasePipe({
    ...(params || {}),
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    exceptionFactory(errors) {
      return recursiveChekings(errors, []);
    },
  });

  function errorParse(err: ValidationError, keys: string[]) {
    for (const [, msg] of Object.entries(err.constraints)) {
      return new BadRequestException({
        field: keys.join('.'),
        message: msg,
      });
    }
  }

  function recursiveChekings(errors: ValidationError[], keys: string[]): any {
    const err = errors[0];
    keys.push(err.property);
    if (err.children.length > 0) {
      return recursiveChekings(err.children, keys);
    }
    return errorParse(err, keys);
  }
}
