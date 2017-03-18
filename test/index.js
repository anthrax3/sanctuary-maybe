'use strict';

var jsc = require('jsverify');
var assert = require('assert');

var S = require('sanctuary');
var Z = require('sanctuary-type-classes');

var Maybe = require('..');

var EitherArb = require('./internal/EitherArb');
var Identity = require('./internal/Identity');
var IdentityArb = require('./internal/IdentityArb');
var MaybeArb = require('./internal/MaybeArb');
var add_ = require('./internal/add_');
var equals = require('./internal/equals');
var laws = require('./internal/laws');


var Nothing = Maybe.Nothing;
var Just = Maybe.Just;


function eq(actual, expected) {
  assert.strictEqual(arguments.length, eq.length);
  assert.strictEqual(Z.toString(actual), Z.toString(expected));
  assert.strictEqual(Z.equals(actual, expected), true);
}

//  head :: Array a -> Maybe a
function head(xs) { return xs.length > 0 ? Just(xs[0]) : Nothing; }

//  inc :: Number -> Number
function inc(n) { return n + 1; }


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
    eq(Z.ap(Maybe.Just(inc), Maybe.Nothing), Maybe.Nothing);
  });

  test('"fantasy-land/chain" method', function() {
    eq(Z.chain(head, Maybe.Nothing), Maybe.Nothing);
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
    eq(Z.ap(Maybe.Just(inc), Maybe.Just(42)), Maybe.Just(43));
  });

  test('"fantasy-land/chain" method', function() {
    eq(Z.chain(head, Maybe.Just([1, 2, 3])), Maybe.Just(1));
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

suite('Maybe', function() {

  suite('Setoid laws', function() {

    var setoidLaws = laws.Setoid;

    setoidLaws.reflexivity(
      MaybeArb(jsc.falsy)
    );

    setoidLaws.symmetry(
      MaybeArb(jsc.bool),
      MaybeArb(jsc.bool)
    );

    setoidLaws.transitivity(
      MaybeArb(jsc.bool),
      MaybeArb(jsc.bool),
      MaybeArb(jsc.bool)
    );

  });

  suite('Semigroup laws', function() {

    var semigroupLaws = laws.Semigroup(equals);

    semigroupLaws.associativity(
      MaybeArb(jsc.string),
      MaybeArb(jsc.string),
      MaybeArb(jsc.string)
    );

  });

  suite('Monoid laws', function() {

    var monoidLaws = laws.Monoid(equals, Maybe);

    monoidLaws.leftIdentity(
      MaybeArb(jsc.string)
    );

    monoidLaws.rightIdentity(
      MaybeArb(jsc.string)
    );

  });

  suite('Functor laws', function() {

    var functorLaws = laws.Functor(equals);

    functorLaws.identity(
      MaybeArb(jsc.number)
    );

    functorLaws.composition(
      MaybeArb(jsc.number),
      jsc.constant(Math.sqrt),
      jsc.constant(Math.abs)
    );

  });

  suite('Apply laws', function() {

    var applyLaws = laws.Apply(equals);

    applyLaws.composition(
      MaybeArb(jsc.constant(Math.sqrt)),
      MaybeArb(jsc.constant(Math.abs)),
      MaybeArb(jsc.number)
    );

  });

  suite('Applicative laws', function() {

    var applicativeLaws = laws.Applicative(equals, Maybe);

    applicativeLaws.identity(
      MaybeArb(jsc.number)
    );

    applicativeLaws.homomorphism(
      jsc.constant(Math.abs),
      jsc.number
    );

    applicativeLaws.interchange(
      MaybeArb(jsc.constant(Math.abs)),
      jsc.number
    );

  });

  suite('Chain laws', function() {

    var chainLaws = laws.Chain(equals);

    chainLaws.associativity(
      MaybeArb(jsc.array(jsc.asciistring)),
      jsc.constant(S.head),
      jsc.constant(S.parseInt(36))
    );

  });

  suite('Monad laws', function() {

    var monadLaws = laws.Monad(equals, Maybe);

    monadLaws.leftIdentity(
      jsc.constant(S.head),
      jsc.string
    );

    monadLaws.rightIdentity(
      MaybeArb(jsc.number)
    );

  });

  suite('Alt laws', function() {

    var altLaws = laws.Alt(equals);

    altLaws.associativity(
      MaybeArb(jsc.number),
      MaybeArb(jsc.number),
      MaybeArb(jsc.number)
    );

    altLaws.distributivity(
      MaybeArb(jsc.number),
      MaybeArb(jsc.number),
      jsc.constant(Math.sqrt)
    );

  });

  suite('Plus laws', function() {

    var plusLaws = laws.Plus(equals, Maybe);

    plusLaws.leftIdentity(
      MaybeArb(jsc.number)
    );

    plusLaws.rightIdentity(
      MaybeArb(jsc.number)
    );

    plusLaws.annihilation(
      jsc.constant(Math.sqrt)
    );

  });

  suite('Alternative laws', function() {

    var alternativeLaws = laws.Alternative(equals, Maybe);

    alternativeLaws.distributivity(
      MaybeArb(jsc.number),
      MaybeArb(jsc.constant(Math.sqrt)),
      MaybeArb(jsc.constant(Math.abs))
    );

    alternativeLaws.annihilation(
      MaybeArb(jsc.number)
    );

  });

  suite('Foldable laws', function() {

    var foldableLaws = laws.Foldable(equals);

    foldableLaws.associativity(
      jsc.constant(add_),
      jsc.number,
      MaybeArb(jsc.number)
    );

  });

  suite('Traversable laws', function() {

    var traversableLaws = laws.Traversable(equals);

    traversableLaws.naturality(
      jsc.constant(S.eitherToMaybe),
      MaybeArb(EitherArb(jsc.string, jsc.number)),
      jsc.constant(S.Either),
      jsc.constant(Maybe)
    );

    traversableLaws.identity(
      MaybeArb(jsc.number),
      jsc.constant(Identity)
    );

    traversableLaws.composition(
      MaybeArb(IdentityArb(MaybeArb(jsc.number))),
      jsc.constant(Identity),
      jsc.constant(Maybe)
    );

  });

  suite('Extend laws', function() {

    var extendLaws = laws.Extend(equals);

    extendLaws.associativity(
      MaybeArb(jsc.integer),
      jsc.constant(function(maybe) { return maybe.value + 1; }),
      jsc.constant(function(maybe) { return maybe.value * maybe.value; })
    );

  });

});
