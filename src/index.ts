import fastDeepEqual from 'fast-deep-equal';

export const isEqual = fastDeepEqual as <A, B>(a: A, b: B) => boolean;

export const assertType = <T>(_: unknown): asserts _ is T => {};

export const pick = <T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
) => {
  const result: Partial<T> = {};
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result as Required<Pick<T, K>>;
};

export const isObject = (value: unknown): value is object => {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
};

// https://stackoverflow.com/a/53968837
interface OmitFunction {
  <T extends object, K extends [...(keyof T)[]]>(obj: T, ...keys: K): {
    [K2 in Exclude<keyof T, K[number]>]: T[K2];
  };
}

export const omit: OmitFunction = (obj, ...keys) => {
  const result = {} as {
    [K in keyof typeof obj]: typeof obj[K];
  };
  for (const key in obj) {
    if (!keys.includes(key)) {
      result[key] = obj[key];
    }
  }
  return result;
};

export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

const print = console.log.bind(console);

export const log = (...args: unknown[]) => {
  return print(...args);
};

type Options = {
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
};

export const fetchJSON = async <Data = unknown>(
  url: string,
  options?: Options
) => {
  if (!options || !('body' in options)) {
    const response = await fetch(
      url,
      options ? (options as Omit<Options, 'body'>) : undefined
    );
    return response.json<Data>();
  }
  const body = JSON.stringify(options.body);
  const response = await fetch(url, {
    ...options,
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      ...options.headers,
    },
    body,
  });
  return response.json<Data>();
};
