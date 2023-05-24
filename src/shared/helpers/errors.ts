import {
  HttpException,
  HttpStatus,
  ServiceUnavailableException,
} from '@nestjs/common';

export class ErrorUnavailable extends ServiceUnavailableException {
  constructor(moduleName: string) {
    super(`have problem when fetch or manage ${moduleName} data`);
  }
}

export function ErrorNotFound(moduleName: string) {
  return new HttpException(`${moduleName} not found`, HttpStatus.NOT_FOUND);
}

export function ErrorExist(moduleName: string) {
  return new HttpException(
    `${moduleName} already exist`,
    HttpStatus.BAD_REQUEST,
  );
}

export function ErrorUsed(moduleName: string) {
  return new HttpException(
    `${moduleName} has associated data`,
    HttpStatus.BAD_REQUEST,
  );
}
