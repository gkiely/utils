import fastDeepEqual from 'fast-deep-equal';

export const isEqual = fastDeepEqual as <A, B>(a: A, b: B) => boolean;

export function assertType<T>(_: unknown): asserts _ is T {}

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

const print = console.log.bind(console);

export function log(...args: unknown[]) {
  return print(...args);
}
