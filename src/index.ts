type Obj = Record<string, unknown>;
function assertType<T>(_: unknown): asserts _ is T {}

// Inspired by:
// https://github.com/smelukov/nano-equal
// https://github.com/epoberezkin/fast-deep-equal
// https://github.com/planttheidea/fast-equals
// https://stackoverflow.com/a/32922084/1845423
export const isEqual = (value: unknown, other: unknown): boolean => {
  const valueType = typeof value;
  const otherType = typeof other;
  let i, keys;

  // Anything that's not an object do a direct comparison
  if (!value || !other || valueType !== 'object' || otherType !== 'object') {
    // Function comparison
    if (valueType === 'function' && otherType === 'function') {
      assertType<() => void>(value);
      assertType<() => void>(other);
      return value === other || value.toString() === other.toString();
    }
    // NaN shortcut
    return (value !== value && other !== other) || value === other;
  }

  if (Array.isArray(value) || Array.isArray(other)) {
    assertType<Obj[]>(value);
    assertType<Obj[]>(other);
    i = value.length;
    if (i !== other.length) return false;

    while (i-- > 0) {
      if (!isEqual(value[i], other[i])) return false;
    }
    return true;
  }
  assertType<Obj>(value);
  assertType<Obj>(other);
  keys = Object.keys(value);
  i = keys.length;

  if (i !== Object.keys(other).length) return false;

  while (i-- > 0) {
    if (!Object.prototype.hasOwnProperty.call(other, keys[i])) return false;
  }
  i = keys.length;

  while (i-- > 0) {
    if (!isEqual(value[keys[i]], other[keys[i]])) return false;
  }

  // RegExp
  if (
    (!Object.prototype.hasOwnProperty.call(value, 'source') && value.source) ||
    (!Object.prototype.hasOwnProperty.call(other, 'source') && other.source)
  ) {
    return value.source === other.source && value.flags === other.flags;
  }

  // Date comparison
  if (value.getTime || other.getTime) {
    if (!value.getTime || !other.getTime) return false;
    if (
      Object.prototype.toString.call(value) === '[object Date]' &&
      Object.prototype.toString.call(other) === '[object Date]'
    ) {
      assertType<Date>(value);
      assertType<Date>(other);
      return value.getTime() === other.getTime();
    }
  }

  return true;
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
