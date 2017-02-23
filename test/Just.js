'use strict';

var M = require('..');

var S = require('sanctuary');
var Z = require('sanctuary-type-classes');

var eq = require('./internal/eq');


suite('Just', function() {

  test('data constructor', function() {
    eq(typeof M.Just, 'function');
    eq(M.Just.length, 1);
    eq(M.Just(42).constructor, M.Maybe);
    eq(M.Just(42).isNothing, false);
    eq(M.Just(42).isJust, true);
  });

  test('"fantasy-land/alt" method', function() {
    eq(Z.alt(M.Nothing, M.Just(1)), M.Just(1));
    eq(Z.alt(M.Just(1), M.Just(2)), M.Just(1));
  });

  test('"fantasy-land/ap" method', function() {
    eq(Z.ap(M.Nothing, M.Just(42)), M.Nothing);
    eq(Z.ap(M.Just(S.inc), M.Just(42)), M.Just(43));
  });

  test('"fantasy-land/chain" method', function() {
    eq(Z.chain(S.head, M.Just([1, 2, 3])), M.Just(1));
  });

  test('"fantasy-land/concat" method', function() {
    eq(Z.concat(M.Just('foo'), M.Nothing), M.Just('foo'));
    eq(Z.concat(M.Just('foo'), M.Just('bar')), M.Just('foobar'));
  });

  test('"fantasy-land/equals" method', function() {
    eq(Z.equals(M.Just(42), M.Just(42)), true);
    eq(Z.equals(M.Just(42), M.Just(43)), false);
    eq(Z.equals(M.Just(42), M.Nothing), false);

    // Value-based equality:
    eq(Z.equals(M.Just(0), M.Just(-0)), false);
    eq(Z.equals(M.Just(-0), M.Just(0)), false);
    eq(Z.equals(M.Just(NaN), M.Just(NaN)), true);
    eq(Z.equals(M.Just([1, 2, 3]), M.Just([1, 2, 3])), true);
  });

  test('"fantasy-land/extend" method', function() {
    eq(Z.extend(function(x) { return x.value / 2; }, M.Just(42)), M.Just(21));
  });

  test('"fantasy-land/map" method', function() {
    eq(Z.map(function(x) { return x / 2; }, M.Just(42)), M.Just(21));
  });

  test('"fantasy-land/reduce" method', function() {
    eq(Z.reduce(function(x, y) { return x - y; }, 42, M.Just(5)), 37);
  });

  test('"toString" method', function() {
    eq(Z.toString(M.Just([1, 2, 3])), 'Just([1, 2, 3])');
  });

  test('"inspect" method', function() {
    eq(M.Just([1, 2, 3]).inspect.length, 0);
    eq(M.Just([1, 2, 3]).inspect(), 'Just([1, 2, 3])');
  });

});
