import { Prisma } from '@prisma/client';

export interface PaginationOptions {
  page: number;
  pageSize: number;
  order: Record<string, 'asc' | 'desc'>;
}

export function PaginationQuery<T extends string>(
  page: number,
  pageSize: number,
  or: T,
  ob: 'asc' | 'desc',
): PaginationOptions {
  const order: Partial<Record<T, 'asc' | 'desc'>> = {};
  const dir = ob == 'asc' ? Prisma.SortOrder.asc : Prisma.SortOrder.desc;
  order[or] = dir;

  return { page, pageSize, order };
}
