import { HttpException } from '@nestjs/common';

import { PaginationResponse } from './dto';

export const UPDATE_GROUP = '_update_group';
export const CREATE_GROUP = '_create_group';

export type ResponseController<T = any> =
  | {
      data: T;
      paginationMeta?: PaginationResponse;
    }
  | HttpException;
