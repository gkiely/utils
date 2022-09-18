import { isEqual } from '../src';

describe('isEqual', () => {
  test.each([
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
  ])('isEqual(%o, %o) -> true', (value, other) => {
    expect(isEqual(value, other)).toBe(true);
  });

  test.each([
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
    [true, false],
    [null, {}],
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
  ])('isEqual(%o, %o) -> false', (value, other) => {
    expect(isEqual(value, other)).toBe(false);
  });
});
