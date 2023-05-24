export function isEmpty<T>(value: T): boolean {
  return (
    value === undefined ||
    value === null ||
    (typeof value == 'string' && value.length < 1) ||
    (typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.keys(value).length < 1)
  );
}
