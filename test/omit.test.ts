import { omit } from '../src';

describe('omit', () => {
  test.each([
    [{}, 'k', {}],
    [{ k: '', key: '' }, 'key', { k: '' }],
    [{ k: false }, 'key', { k: false }],
    [{ k: false }, 'k', {}],
  ])('omit(%o, %s) -> %o', (value, keys, result) => {
    expect(omit(value, keys)).toEqual(result);
  });
});
