import { isEqual } from '../src';

export const passTests = [
  [{}, {}],
  [[], []],
  [{ key: 'value' }, { key: 'value' }],
  [{ key: 1 }, { key: 1 }],
  [{ key: {} }, { key: {} }],
  [{ key: [1] }, { key: [1] }],
  [{ key: Infinity }, { key: Infinity }],
  [{ key: null }, { key: null }],
  [{ key: undefined }, { key: undefined }],
  [true, true],
  [{ toString: () => 'Hello world!' }, { toString: () => 'Hello world!' }],
  [/test/, /test/],
  [
    {
      key: NaN,
    },
    {
      key: NaN,
    },
  ],
  [
    {
      key: new Date(2020, 9, 25),
    },
    {
      key: new Date(2020, 9, 25),
    },
  ],
  [
    {
      key: [1, 2, { prop2: 1, prop: 2 }, 4, 5],
    },
    {
      key: [1, 2, { prop2: 1, prop: 2 }, 4, 5],
    },
  ],
  [
    {
      parent: {
        child: [
          {
            nested: {
              nested: {},
            },
          },
        ],
      },
    },
    {
      parent: {
        child: [
          {
            nested: {
              nested: {},
            },
          },
        ],
      },
    },
  ],
] as const;

function func1() {}
function func2() {}

export const failTests = [
  [{ key: '1' }, { k: '1' }],
  [{ key: {} }, { k: '1' }],
  [{ key: {} }, { key: [] }],
  [{}, { k: '1' }],
  [{ key: [] }, { key: [1] }],
  [undefined, {}],
  [[], {}],
  [{ key: Infinity }, { key: -Infinity }],
  [{ foo: undefined }, { bar: undefined }],
  [new Date(2020, 9, 25), {}],
  [new Date('2017-06-16T21:36:48.362Z'), new Date('2017-01-01T00:00:00.000Z')],
  [true, false],
  [null, {}],
  [/test/, /fail/],
  [{ toString: () => 'test' }, { toString: () => 'fail' }],
  [func1, func2],
  [
    {
      key: NaN,
    },
    {
      key: 1,
    },
  ],
  [{}, []],
  [
    {
      parent: [],
      key: {},
    },
    {
      parent: {},
      key: {},
    },
  ],
  [
    {
      parent: {
        child: [
          {
            nested: {
              nested: {},
            },
          },
        ],
      },
    },
    {
      parent: {
        child: [
          {
            nested: {
              changed: {},
            },
          },
        ],
      },
    },
  ],
] as const;

describe('isEqual', () => {
  test.each(passTests)('isEqual(%o, %o) -> true', (value, other) => {
    expect(isEqual(value, other)).toBe(true);
  });

  test.each(failTests)('isEqual(%o, %o) -> false', (value, other) => {
    expect(isEqual(value, other)).toBe(false);
  });
});
