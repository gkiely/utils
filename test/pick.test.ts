// import { assertType, pick } from '../src';

// describe('pick', () => {
//   test.each([
//     [{}, 'k', {}],
//     [{ k: '', key: '' }, 'key', { key: '' }],
//     [{ k: false }, 'key', {}],
//     [{ k: false }, 'k', { k: false }],
//   ])('pick(%o, %s) -> %o', (value, keys, result) => {
//     assertType<keyof typeof value>(keys);
//     expect(pick(value, keys)).toEqual(result);
//   });
// });
