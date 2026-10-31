import test from 'node:test';
import assert from 'node:assert/strict';
import { estimate, parseHomeValue } from '../src/calculator.js';

test('both questions at $200,000 use both baselines', () => {
  const result = estimate(200000, 'both');
  assert.equal(result.todayAnnual, 50);
  assert.equal(result.noBondAnnual, 175);
  assert.equal(result.todayMonthly.toFixed(2), '4.17');
  assert.equal(result.noBondMonthly.toFixed(2), '14.58');
});
test('Q1 maintains current rate and forgoes projected reduction', () => {
  assert.equal(estimate(200000, 'q1').todayAnnual, 0);
  assert.equal(estimate(200000, 'q1').noBondAnnual, 125);
});
test('no authorization reduces taxes and has no difference from itself', () => {
  assert.equal(estimate(200000, 'neither').todayAnnual, -125);
  assert.equal(estimate(200000, 'neither').noBondAnnual, 0);
});
test('district homepage examples scale proportionally', () => {
  for (const [value, annual] of [[75000, 18.75], [100000, 25], [300000, 75], [400000, 100]]) {
    assert.equal(estimate(value, 'both').todayAnnual, annual);
  }
});
test('input accepts currency, separators and cents', () => {
  assert.equal(parseHomeValue('$200,000'), 200000);
  assert.equal(parseHomeValue('150000.50'), 150000.5);
});
test('invalid and out-of-range input is rejected', () => {
  for (const input of ['', 'abc', '-1', '0', '100000001', 'Infinity', '12.345', '1e6']) assert.equal(parseHomeValue(input), null);
  for (const value of [0, -1, NaN, Infinity, 100000001]) assert.throws(() => estimate(value, 'both'), RangeError);
  assert.throws(() => estimate(200000, 'q2'), RangeError);
});
