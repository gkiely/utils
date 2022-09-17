function assertType<T>(_value: unknown): asserts _value is T {}

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
  const arr = [valueType, otherType];

  if (arr.includes('NaN')) return true;

  const hasObject = arr.some(o => ['object', 'array'].includes(o));
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
