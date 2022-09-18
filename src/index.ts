type Obj = Record<string, unknown>;
export function assertType<T>(_value: unknown): asserts _value is T {}

const types = {
  NaN: 'NaN',
  object: 'object',
  array: 'array',
  number: 'number',
  date: 'date',
  null: 'null',
} as const;

const getValueType = (value: unknown) => {
  const t = typeof value;
  if (t === types.object && value !== null) {
    if (Array.isArray(value)) return types.array;
    if (value instanceof Date) return types.date;
    return types.object;
  }
  if (t === types.number && Number.isNaN(value)) return types.NaN;
  if (value === null) return types.null;
  return t;
};

// Inspired by:
// https://github.com/smelukov/nano-equal
// https://stackoverflow.com/a/32922084/1845423
// This function is benchmarked using vitest bench
export const isEqual = (value: unknown, other: unknown): boolean => {
  if (value === other) return true;
  const valueType = getValueType(value);
  const otherType = getValueType(other);
  if (valueType !== otherType) return false;
  if (valueType === types.NaN && otherType === types.NaN) return true;
  if (valueType === types.date && otherType === types.date) {
    assertType<Date>(value);
    assertType<Date>(other);
    return value.getTime() === other.getTime();
  }

  const hasObject =
    valueType === types.object ||
    valueType === types.array ||
    otherType === types.object ||
    otherType === types.array;

  if (!hasObject) return value === other;

  assertType<Obj>(value);
  assertType<Obj>(other);

  const valueKeys = Object.keys(value);
  const otherKeys = Object.keys(other);
  if (valueKeys.length === 0 && otherKeys.length === 0) return true;

  return (
    valueKeys.length === otherKeys.length &&
    !valueKeys.some(k => (k in other ? !isEqual(value[k], other[k]) : true))
  );
};

export function pick<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
) {
  const result: Partial<T> = {};
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result as Required<Pick<T, K>>;
}

export const isObject = (value: unknown): value is object => {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
};

export const omit = (obj: object, ...keys: string[]) => {
  const result: { [key: string]: unknown } = {};
  for (const key in obj) {
    if (!keys.includes(key)) {
      result[key] = obj[key as keyof typeof obj];
    }
  }
  return result;
};

export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));
