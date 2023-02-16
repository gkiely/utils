import fastDeepEqual from 'fast-deep-equal';

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [x: string]: JSONValue }
  | Array<JSONValue>;
export type JSONObject = Record<string, JSONValue>;
export type JSValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | { [x: string]: JSValue }
  | Array<JSValue>;
export type JSObject = Record<string, JSValue>;
export type JSONResponse = JSONObject | Array<JSONValue>;

export const isEqual = fastDeepEqual as <A, B>(a: A, b: B) => boolean;

export function assertType<T>(_: unknown): asserts _ is T {}

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

// Handles both text and JSON responses
export const fetchData = async <Data = JSONResponse>(
  url: string,
  options?: Options
) => {
  if (!options || !('body' in options)) {
    const response = await fetch(
      url,
      options ? (options as Omit<Options, 'body'>) : undefined
    );
    if (!response.ok) {
      return Promise.reject(`Failed fetch: ${response.status}`);
    }
    const text = await response.text();
    try {
      return JSON.parse(text) as Data;
    } catch {
      if (!text) return undefined;
      return text;
    }
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
  if (!response.ok) {
    return Promise.reject(`Failed fetch: ${response.status}`);
  }
  const text = await response.text();
  try {
    return JSON.parse(text) as Data;
  } catch {
    return text;
  }
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
      ...options.headers,
    },
    body,
  });
  if (!response.ok) {
    const text = await response.text();
    let body: JSONValue = text;
    try {
      body = JSON.parse(text);
    } catch {}

    return Promise.reject({
      status: response.status,
      statusText: response.statusText,
      body,
    });
  }
  return response.json<Data>();
};

export const fetchText = async (url: string, options?: Options) => {
  const response = await fetch(
    url,
    options ? (options as Omit<Options, 'body'>) : undefined
  );
  if (!response.ok) {
    return Promise.reject(`Failed fetch: ${response.status}`);
  }
  return response.text();

  // GET and POST version if needed
  // if (!options || !('body' in options)) {
  //   const response = await fetch(url, options ? (options as Omit<Options, 'body'>) : undefined);
  //   if (!response.ok) {
  //     return Promise.reject(`Failed fetch: ${response.status}`);
  //   }
  //   return response.text();
  // }
  // const body = JSON.stringify(options.body);
  // const response = await fetch(url, {
  //   ...options,
  //   method: 'POST',
  //   headers: {
  //     accept: 'text/html',
  //     'content-type': 'text/plain',
  //     ...options.headers,
  //   },
  //   body,
  // });
  // return response.text();
};
