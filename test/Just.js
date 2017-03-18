'use strict';

var S = require('sanctuary');
var Z = require('sanctuary-type-classes');

var Maybe = require('..');

var eq = require('./internal/eq');


suite('Just', function() {

  test('data constructor', function() {
    eq(typeof Maybe.Just, 'function');
    eq(Maybe.Just.length, 1);
    eq(Maybe.Just(42).constructor, Maybe);
    eq(Maybe.Just(42).isNothing, false);
    eq(Maybe.Just(42).isJust, true);
  });

  test('"fantasy-land/alt" method', function() {
    eq(Z.alt(Maybe.Nothing, Maybe.Just(1)), Maybe.Just(1));
    eq(Z.alt(Maybe.Just(1), Maybe.Just(2)), Maybe.Just(1));
  });

  test('"fantasy-land/ap" method', function() {
    eq(Z.ap(Maybe.Nothing, Maybe.Just(42)), Maybe.Nothing);
    eq(Z.ap(Maybe.Just(S.inc), Maybe.Just(42)), Maybe.Just(43));
  });

  test('"fantasy-land/chain" method', function() {
    eq(Z.chain(S.head, Maybe.Just([1, 2, 3])), Maybe.Just(1));
  });

  test('"fantasy-land/concat" method', function() {
    eq(Z.concat(Maybe.Just('foo'), Maybe.Nothing), Maybe.Just('foo'));
    eq(Z.concat(Maybe.Just('foo'), Maybe.Just('bar')), Maybe.Just('foobar'));
  });

  test('"fantasy-land/equals" method', function() {
    eq(Z.equals(Maybe.Just(42), Maybe.Just(42)), true);
    eq(Z.equals(Maybe.Just(42), Maybe.Just(43)), false);
    eq(Z.equals(Maybe.Just(42), Maybe.Nothing), false);

    // Value-based equality:
    eq(Z.equals(Maybe.Just(0), Maybe.Just(-0)), false);
    eq(Z.equals(Maybe.Just(-0), Maybe.Just(0)), false);
    eq(Z.equals(Maybe.Just(NaN), Maybe.Just(NaN)), true);
    eq(Z.equals(Maybe.Just([1, 2, 3]), Maybe.Just([1, 2, 3])), true);
  });

  test('"fantasy-land/extend" method', function() {
    eq(Z.extend(function(x) { return x.value / 2; }, Maybe.Just(42)), Maybe.Just(21));
  });

  test('"fantasy-land/map" method', function() {
    eq(Z.map(function(x) { return x / 2; }, Maybe.Just(42)), Maybe.Just(21));
  });

  test('"fantasy-land/reduce" method', function() {
    eq(Z.reduce(function(x, y) { return x - y; }, 42, Maybe.Just(5)), 37);
  });

  test('"toString" method', function() {
    eq(Z.toString(Maybe.Just([1, 2, 3])), 'Just([1, 2, 3])');
  });

  test('"inspect" method', function() {
    eq(Maybe.Just([1, 2, 3]).inspect.length, 0);
    eq(Maybe.Just([1, 2, 3]).inspect(), 'Just([1, 2, 3])');
  });

});
