'use strict';

var M = require('..');

var S = require('sanctuary');
var Z = require('sanctuary-type-classes');

var eq = require('./internal/eq');


suite('Nothing', function() {

  test('member of the "Maybe a" type', function() {
    eq(M.Nothing.constructor, M.Maybe);
    eq(M.Nothing.isNothing, true);
    eq(M.Nothing.isJust, false);
  });

  test('"fantasy-land/alt" method', function() {
    eq(Z.alt(M.Nothing, M.Nothing), M.Nothing);
    eq(Z.alt(M.Nothing, M.Just(1)), M.Just(1));
  });

  test('"fantasy-land/ap" method', function() {
    eq(Z.ap(M.Nothing, M.Nothing), M.Nothing);
    eq(Z.ap(M.Just(S.inc), M.Nothing), M.Nothing);
  });

  test('"fantasy-land/chain" method', function() {
    eq(Z.chain(S.head, M.Nothing), M.Nothing);
  });

  test('"fantasy-land/concat" method', function() {
    eq(Z.concat(M.Nothing, M.Nothing), M.Nothing);
    eq(Z.concat(M.Just('foo'), M.Nothing), M.Just('foo'));
  });

  test('"fantasy-land/equals" method', function() {
    eq(Z.equals(M.Nothing, M.Nothing), true);
    eq(Z.equals(M.Nothing, M.Just(42)), false);
  });

  test('"fantasy-land/extend" method', function() {
    eq(Z.extend(function(x) { return x.value / 2; }, M.Nothing), M.Nothing);
  });

  test('"fantasy-land/map" method', function() {
    eq(Z.map(function() { return 42; }, M.Nothing), M.Nothing);
  });

  test('"fantasy-land/reduce" method', function() {
    eq(Z.reduce(function(x, y) { return x - y; }, 42, M.Nothing), 42);
  });

  test('"toString" method', function() {
    eq(Z.toString(M.Nothing), 'Nothing');
  });

  test('"inspect" method', function() {
    eq(M.Nothing.inspect.length, 0);
    eq(M.Nothing.inspect(), 'Nothing');
  });

});
