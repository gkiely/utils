type Obj = Record<string, unknown>;
export function assertType<T>(_value: unknown): asserts _value is T {}

// Inspired by:
// https://github.com/smelukov/nano-equal
// https://stackoverflow.com/a/32922084/1845423

// Test cases:
// NaN: https://jsbench.me/ufl8alurdm/1
// Function comparison: https://jsbench.me/svl8alrui7/1
// Regex: https://jsbench.me/ctl8altfg2/1
// Array: https://jsbench.me/osl8am10pi/3
export const isEqual = (value: unknown, other: unknown): boolean => {
  const valueType = typeof value;
  const otherType = typeof other;

  // Anything other than an object, do a === compare
  if (!value || !other || valueType !== 'object' || otherType !== 'object') {
    // NaN shortcut
    if (value !== value && other !== other) return true;
    if (valueType === 'function' && otherType === 'function') {
      assertType<() => void>(value);
      assertType<() => void>(other);
      return value.toString() === other.toString();
    }
    return value === other;
  }

  if (value instanceof Date || other instanceof Date) {
    assertType<Date>(value);
    assertType<Date>(other);

    return (
      value instanceof Date &&
      other instanceof Date &&
      value.getTime() === other.getTime()
    );
  }
  if (value instanceof RegExp && other instanceof RegExp) {
    assertType<RegExp>(value);
    assertType<RegExp>(other);
    return value.source === other.source && value.flags === other.flags;
  }

  if (Array.isArray(value) || Array.isArray(other)) {
    assertType<Obj[]>(value);
    assertType<Obj[]>(other);
    let i = value.length;
    if (i !== other.length) return false;
    for (; i-- > 0; ) {
      if (!isEqual(value[i], other[i])) return false;
    }
    return true;
  }
  assertType<Obj>(value);
  assertType<Obj>(other);
  let hasKeys = false;
  for (const k in value) {
    !hasKeys && (hasKeys = true);
    if (!Object.prototype.hasOwnProperty.call(other, k)) return false;
    if (!isEqual(value[k], other[k])) return false;
  }
  if (!hasKeys) {
    return Object.keys(other).length === 0;
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
