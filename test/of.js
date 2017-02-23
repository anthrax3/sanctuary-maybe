'use strict';

var M = require('..');

var Z = require('sanctuary-type-classes');

var eq = require('./internal/eq');


test('of', function() {
  eq(Z.of(M.Maybe, 42), M.Just(42));
});
