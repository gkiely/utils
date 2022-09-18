import Benchmark from 'benchmark';
import { passTests, failTests } from './isEqual.test';
import { isEqual } from '../src';
import fastDeepEqual from 'fast-deep-equal';

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
