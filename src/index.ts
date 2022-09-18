export function assertType<T>(_value: unknown): asserts _value is T {}

const getValueType = (value: unknown) => {
  const t = typeof value;
  if (t === 'object' && Array.isArray(value)) return 'array';
  if (t === 'object' && value !== null) return 'object';
  if (t === 'number' && Number.isNaN(value)) return 'NaN';
  return t;
};

// Inspired by:
// https://github.com/smelukov/nano-equal
// https://stackoverflow.com/a/32922084/1845423
export const isEqual = (value: unknown, other: unknown): boolean => {
  if (value === other) return true;
  const valueType = getValueType(value);
  const otherType = getValueType(other);
  const types = [valueType, otherType];

  if (types.every(o => o === 'NaN')) return true;

  const hasObject = types.some(o => ['object', 'array'].includes(o));
  if (!hasObject) {
    return value === other;
  }
  if (valueType !== otherType) return false;

  assertType<Record<string, unknown>>(value);
  assertType<Record<string, unknown>>(other);

  const v = Object.keys(value);
  const o = Object.keys(other);
  if (v.length === 0 && o.length === 0) return true;

  return v.length === o.length && v.every(k => isEqual(value[k], other[k]));
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
