'use strict';

var assert = require('assert');

var Z = require('sanctuary-type-classes');

var equals = require('./equals');

//  eq :: (a, b) -> Undefined !
module.exports = function eq(actual, expected) {
  assert.strictEqual(arguments.length, eq.length);
  assert.strictEqual(Z.toString(actual), Z.toString(expected));
  assert.strictEqual(equals(actual)(expected), true);
};
