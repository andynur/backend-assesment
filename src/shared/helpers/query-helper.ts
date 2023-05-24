import { Prisma } from '@prisma/client';
import { dot, object as dotObject } from 'dot-object';
import { isEmpty } from './utils';
const helperCallback = (v) => v;
export function queryIfNotEmpty<T, R>(value: T, query?: (value: T) => R) {
  if (query === undefined) {
    query = helperCallback;
  }
  if (Array.isArray(value)) {
    if (value.every((it) => isEmpty(it))) {
      return undefined;
    }
    return query(value);
  }
  if (isEmpty(value)) {
    return undefined;
  }
  return query(value);
}

export function Contains<T>(val: T) {
  return queryIfNotEmpty(val, (v) => {
    return {
      contains: v,
      mode: 'insensitive' as Prisma.QueryMode,
    };
  });
}

export function reduceQuery(conditions: Record<string, any>) {
  const dotConditions = dot(conditions);
  const hasQuery = Object.entries(dotConditions).filter(([, val]) => {
    const mustExclude = val !== undefined && val !== null;
    return mustExclude;
  });
  if (hasQuery.length < 1) {
    return {} as any;
  }
  const newQuery = dotObject(Object.fromEntries(hasQuery));
  return { where: newQuery };
}
