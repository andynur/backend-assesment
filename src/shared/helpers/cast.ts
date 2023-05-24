import moment from 'moment';

interface ToNumberOptions {
  default?: number;
  min?: number;
  max?: number;
}

export function trim(value: string): string {
  return value.trim();
}

export function toDate(value: string): Date {
  const parse = moment.utc(value, 'YYYY-MM-DD');
  return parse.isValid() ? parse.startOf('d').toDate() : null;
}

export function toBoolean(value: string): boolean {
  const newValue = String(value).toLowerCase();

  return newValue === 'true' || newValue === '1' ? true : false;
}

export function toNumber(value: string, opts: ToNumberOptions = {}): number {
  let newValue: number = Number.parseInt(value || String(opts.default), 10);
  if (Number.isNaN(newValue)) {
    newValue = opts.default;
  }

  if (opts.min) {
    if (newValue < opts.min) {
      newValue = opts.min;
    }

    if (newValue > opts.max) {
      newValue = opts.max;
    }
  }

  return newValue;
}
