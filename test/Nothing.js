'use strict';

var S = require('sanctuary');
var Z = require('sanctuary-type-classes');

var Maybe = require('..');

var eq = require('./internal/eq');


suite('Nothing', function() {

  test('member of the "Maybe a" type', function() {
    eq(Maybe.Nothing.constructor, Maybe);
    eq(Maybe.Nothing.isNothing, true);
    eq(Maybe.Nothing.isJust, false);
  });

  test('"fantasy-land/alt" method', function() {
    eq(Z.alt(Maybe.Nothing, Maybe.Nothing), Maybe.Nothing);
    eq(Z.alt(Maybe.Nothing, Maybe.Just(1)), Maybe.Just(1));
  });

  test('"fantasy-land/ap" method', function() {
    eq(Z.ap(Maybe.Nothing, Maybe.Nothing), Maybe.Nothing);
    eq(Z.ap(Maybe.Just(S.inc), Maybe.Nothing), Maybe.Nothing);
  });

  test('"fantasy-land/chain" method', function() {
    eq(Z.chain(S.head, Maybe.Nothing), Maybe.Nothing);
  });

  test('"fantasy-land/concat" method', function() {
    eq(Z.concat(Maybe.Nothing, Maybe.Nothing), Maybe.Nothing);
    eq(Z.concat(Maybe.Just('foo'), Maybe.Nothing), Maybe.Just('foo'));
  });

  test('"fantasy-land/equals" method', function() {
    eq(Z.equals(Maybe.Nothing, Maybe.Nothing), true);
    eq(Z.equals(Maybe.Nothing, Maybe.Just(42)), false);
  });

  test('"fantasy-land/extend" method', function() {
    eq(Z.extend(function(x) { return x.value / 2; }, Maybe.Nothing), Maybe.Nothing);
  });

  test('"fantasy-land/map" method', function() {
    eq(Z.map(function() { return 42; }, Maybe.Nothing), Maybe.Nothing);
  });

  test('"fantasy-land/reduce" method', function() {
    eq(Z.reduce(function(x, y) { return x - y; }, 42, Maybe.Nothing), 42);
  });

  test('"toString" method', function() {
    eq(Z.toString(Maybe.Nothing), 'Nothing');
  });

  test('"inspect" method', function() {
    eq(Maybe.Nothing.inspect.length, 0);
    eq(Maybe.Nothing.inspect(), 'Nothing');
  });

});
