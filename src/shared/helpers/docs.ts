export function OrderRuleApiQueryOptions(items: string[]) {
  return {
    required: false,
    name: 'or',
    description: 'order rule (field name)',
    enum: items,
  };
}

export function OrderByApiQueryOptions() {
  return {
    required: false,
    name: 'ob',
    description: 'order by',
    enum: ['asc', 'desc'],
  };
}

export function PageApiQueryOptions() {
  return {
    required: false,
    name: 'page',
    description: 'page number',
  };
}

export function PageSizeApiQueryOptions() {
  return {
    required: false,
    name: 'page_size',
    description: 'size page',
  };
}
