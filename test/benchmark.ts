/* eslint-disable */
// @ts-nocheck
const Benchmark = require('benchmark');

const tests = [
  [{}, {}],
  [{ key: 'value' }, { key: 'value' }],
  [{ key: 1 }, { key: 1 }],
  [{ key: {} }, { key: {} }],
  [{ key: [1] }, { key: [1] }],
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
];

const fastDeepEqual = require('fast-deep-equal');
const { isEqual } = require('@gkiely/utils');

const suite = new Benchmark.Suite();

suite
  .add('fast-deep-equal', () => {
    passTests.forEach(test => fastDeepEqual(test[0], test[1]));
    failTests.forEach(test => fastDeepEqual(test[0], test[1]));
  })
  .add('@gkiely/utils.isEqual', () => {
    passTests.forEach(test => isEqual(test[0], test[1]));
    failTests.forEach(test => isEqual(test[0], test[1]));
  })
  .on('cycle', event => console.log(String(event.target)))
  .on('complete', function() {
    console.log('The fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ async: true });
