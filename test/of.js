'use strict';

var Z = require('sanctuary-type-classes');

var Maybe = require('..');

var eq = require('./internal/eq');


test('of', function() {
  eq(Z.of(Maybe, 42), Maybe.Just(42));
});
