type Obj = Record<string, unknown>;
function assertType<T>(_value: unknown): asserts _value is T {}

// Inspired by:
// https://github.com/smelukov/nano-equal
// https://stackoverflow.com/a/32922084/1845423
// This function is benchmarked using vitest bench
export const isEqual = (value: unknown, other: unknown): boolean => {
  const valueType = typeof value;
  const otherType = typeof other;
  if (valueType !== otherType) return false;
  // NaN
  if (value !== value && other !== other) return true;
  if (value instanceof Date || other instanceof Date) {
    assertType<Date>(value);
    assertType<Date>(other);

    return (
      value instanceof Date &&
      other instanceof Date &&
      value.getTime() === other.getTime()
    );
  }
  if (valueType === 'function' && otherType === 'function') {
    assertType<() => void>(value);
    assertType<() => void>(other);
    return value.toString() === other.toString();
  }
  if (value instanceof RegExp && other instanceof RegExp) {
    assertType<RegExp>(value);
    assertType<RegExp>(other);
    return value.source === other.source && value.flags === other.flags;
  }

  if (value === null || other === null) return value === other;
  if (valueType === 'object' && otherType === 'object') {
    if (Array.isArray(value) || Array.isArray(other)) {
      assertType<Obj[]>(value);
      assertType<Obj[]>(other);
      let i = value.length;
      if (i !== other.length) return false;
      while (i-- > 0) {
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
  }

  return value === other;
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
