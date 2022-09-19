// Command: node --trace_opt ./test/trace-performance.js | grep isEqual
const types = {
  NaN: 'NaN',
  object: 'object',
  array: 'array',
  number: 'number',
  date: 'date',
  null: 'null',
  function: 'function',
  regexp: 'regexp',
};

const getValueType = value => {
  const t = typeof value;

  if (t === types.object) {
    if (value === null) return types.null;
    if (Array.isArray(value)) return types.array;
    if (value instanceof Date) return types.date;
    if (value instanceof RegExp) return types.regexp;
    return types.object;
  }

  if (t === types.number && Number.isNaN(value)) return types.NaN;
  return t;
};

const isEqual = (value, other) => {
  const valueType = getValueType(value);
  const otherType = getValueType(other);
  if (valueType !== otherType) return false;
  if (valueType === types.NaN) return valueType === otherType;

  if (valueType === types.date && otherType === types.date) {
    return value.getTime() === other.getTime();
  }

  if (valueType === types.function && otherType === types.function) {
    return value.toString() === other.toString();
  }

  if (valueType === types.regexp && otherType === types.regexp) {
    return value.source === other.source && value.flags === other.flags;
  }

  if (valueType === types.array && otherType === types.array) {
    if (value.length !== other.length) return false;
    let i = value.length;

    while (i-- > 0) {
      if (!isEqual(value[i], other[i])) return false;
    }

    return true;
  }

  if (valueType === types.object && otherType === types.object) {
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

let k = 1e6;

console.time('isEqual');
while (k--) {
  isEqual({}, {});
}
console.timeEnd('isEqual');
