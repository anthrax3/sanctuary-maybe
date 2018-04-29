'use strict';

var assert = require('assert');

var laws = require('fantasy-laws');
var jsc = require('jsverify');
var Either = require('sanctuary-either');
var Identity = require('sanctuary-identity');
var show = require('sanctuary-show');
var Z = require('sanctuary-type-classes');

var Maybe = require('..');


var Nothing = Maybe.Nothing;
var Just = Maybe.Just;


function eq(actual, expected) {
  assert.strictEqual(arguments.length, eq.length);
  assert.strictEqual(show(actual), show(expected));
  assert.strictEqual(Z.equals(actual, expected), true);
}

//  EitherArb :: Arbitrary a -> Arbitrary b -> Arbitrary (Either a b)
function EitherArb(lArb, rArb) {
  return jsc.oneof(lArb.smap(Either.Left, value, show),
                   rArb.smap(Either.Right, value, show));
}

//  IdentityArb :: Arbitrary a -> Arbitrary (Identity a)
function IdentityArb(arb) {
  return arb.smap(Identity, value, show);
}

//  MaybeArb :: Arbitrary a -> Arbitrary (Maybe a)
function MaybeArb(arb) {
  return jsc.oneof(arb.smap(Maybe.Just, value, show),
                   jsc.constant(Maybe.Nothing));
}

//  add_ :: (Number, Number) -> Number
function add_(a, b) { return a + b; }

//  eitherToMaybe :: Either a b -> Maybe b
function eitherToMaybe(e) { return e.isLeft ? Nothing : Just(e.value); }

//  head :: Array a -> Maybe a
function head(xs) { return xs.length > 0 ? Just(xs[0]) : Nothing; }

//  inc :: Number -> Number
function inc(n) { return n + 1; }

//  parseFloat_ :: String -> Maybe Number
function parseFloat_(s) {
  var n = parseFloat(s);
  return isNaN(n) ? Nothing : Just(n);
}

//  value :: { value :: a } -> a
function value(r) { return r.value; }


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

    eq(Z.Semigroup.test(Maybe.Nothing), true);
  });

  test('"fantasy-land/equals" method', function() {
    eq(Z.equals(Maybe.Nothing, Maybe.Nothing), true);
    eq(Z.equals(Maybe.Nothing, Maybe.Just(42)), false);
  });

  test('"fantasy-land/extend" method', function() {
    eq(Z.extend(function(x) { return x.value / 2; }, Maybe.Nothing), Maybe.Nothing);
  });

  test('"fantasy-land/filter" method', function() {
    eq(Z.filter(isFinite, Maybe.Nothing), Maybe.Nothing);
  });

  test('"fantasy-land/lte" method', function() {
    eq(Z.lte(Maybe.Nothing, Maybe.Nothing), true);
    eq(Z.lte(Maybe.Nothing, Maybe.Just(0)), true);

    eq(Z.Ord.test(Maybe.Nothing), true);
  });

  test('"fantasy-land/map" method', function() {
    eq(Z.map(function() { return 42; }, Maybe.Nothing), Maybe.Nothing);
  });

  test('"fantasy-land/reduce" method', function() {
    eq(Z.reduce(function(x, y) { return x - y; }, 42, Maybe.Nothing), 42);
  });

  test('"@@show" method', function() {
    eq(show(Maybe.Nothing), 'Nothing');
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

    eq(Z.Semigroup.test(Maybe.Just('abc')), true);
    eq(Z.Semigroup.test(Maybe.Just(123)), false);
  });

  test('"fantasy-land/equals" method', function() {
    eq(Z.equals(Maybe.Just(42), Maybe.Just(42)), true);
    eq(Z.equals(Maybe.Just(42), Maybe.Just(43)), false);
    eq(Z.equals(Maybe.Just(42), Maybe.Nothing), false);

    // Value-based equality:
    eq(Z.equals(Maybe.Just(0), Maybe.Just(-0)), true);
    eq(Z.equals(Maybe.Just(-0), Maybe.Just(0)), true);
    eq(Z.equals(Maybe.Just(NaN), Maybe.Just(NaN)), true);
    eq(Z.equals(Maybe.Just([1, 2, 3]), Maybe.Just([1, 2, 3])), true);
  });

  test('"fantasy-land/extend" method', function() {
    eq(Z.extend(function(x) { return x.value / 2; }, Maybe.Just(42)), Maybe.Just(21));
  });

  test('"fantasy-land/filter" method', function() {
    eq(Z.filter(isFinite, Maybe.Just(Infinity)), Maybe.Nothing);
    eq(Z.filter(isFinite, Maybe.Just(Number.MAX_SAFE_INTEGER)), Maybe.Just(9007199254740991));
  });

  test('"fantasy-land/lte" method', function() {
    eq(Z.lte(Maybe.Just(1), Maybe.Nothing), false);
    eq(Z.lte(Maybe.Just(1), Maybe.Just(0)), false);
    eq(Z.lte(Maybe.Just(1), Maybe.Just(1)), true);
    eq(Z.lte(Maybe.Just(1), Maybe.Just(2)), true);

    eq(Z.Ord.test(Maybe.Just(1)), true);
    eq(Z.Ord.test(Maybe.Just(Math.sqrt)), false);
  });

  test('"fantasy-land/map" method', function() {
    eq(Z.map(function(x) { return x / 2; }, Maybe.Just(42)), Maybe.Just(21));
  });

  test('"fantasy-land/reduce" method', function() {
    eq(Z.reduce(function(x, y) { return x - y; }, 42, Maybe.Just(5)), 37);
  });

  test('"@@show" method', function() {
    eq(show(Maybe.Just([1, 2, 3])), 'Just ([1, 2, 3])');
  });

  test('"inspect" method', function() {
    eq(Maybe.Just([1, 2, 3]).inspect.length, 0);
    eq(Maybe.Just([1, 2, 3]).inspect(), 'Just ([1, 2, 3])');
  });

});

suite('Maybe', function() {

  suite('Setoid laws', function() {

    test('reflexivity',
         laws.Setoid.reflexivity(
           MaybeArb(jsc.falsy)
         ));

    test('symmetry',
         laws.Setoid.symmetry(
           MaybeArb(jsc.bool),
           MaybeArb(jsc.bool)
         ));

    test('transitivity',
         laws.Setoid.transitivity(
           MaybeArb(jsc.bool),
           MaybeArb(jsc.bool),
           MaybeArb(jsc.bool)
         ));

  });

  suite('Semigroup laws', function() {

    test('associativity',
         laws.Semigroup(Z.equals).associativity(
           MaybeArb(jsc.string),
           MaybeArb(jsc.string),
           MaybeArb(jsc.string)
         ));

  });

  suite('Monoid laws', function() {

    test('left identity',
         laws.Monoid(Z.equals, Maybe).leftIdentity(
           MaybeArb(jsc.string)
         ));

    test('right identity',
         laws.Monoid(Z.equals, Maybe).rightIdentity(
           MaybeArb(jsc.string)
         ));

  });

  suite('Functor laws', function() {

    test('identity',
         laws.Functor(Z.equals).identity(
           MaybeArb(jsc.number)
         ));

    test('composition',
         laws.Functor(Z.equals).composition(
           MaybeArb(jsc.number),
           jsc.constant(Math.sqrt),
           jsc.constant(Math.abs)
         ));

  });

  suite('Apply laws', function() {

    test('composition',
         laws.Apply(Z.equals).composition(
           MaybeArb(jsc.constant(Math.sqrt)),
           MaybeArb(jsc.constant(Math.abs)),
           MaybeArb(jsc.number)
         ));

  });

  suite('Applicative laws', function() {

    test('identity',
         laws.Applicative(Z.equals, Maybe).identity(
           MaybeArb(jsc.number)
         ));

    test('homomorphism',
         laws.Applicative(Z.equals, Maybe).homomorphism(
           jsc.constant(Math.abs),
           jsc.number
         ));

    test('interchange',
         laws.Applicative(Z.equals, Maybe).interchange(
           MaybeArb(jsc.constant(Math.abs)),
           jsc.number
         ));

  });

  suite('Chain laws', function() {

    test('associativity',
         laws.Chain(Z.equals).associativity(
           MaybeArb(jsc.array(jsc.asciistring)),
           jsc.constant(head),
           jsc.constant(parseFloat_)
         ));

  });

  suite('Monad laws', function() {

    test('left identity',
         laws.Monad(Z.equals, Maybe).leftIdentity(
           jsc.constant(head),
           jsc.string
         ));

    test('right identity',
         laws.Monad(Z.equals, Maybe).rightIdentity(
           MaybeArb(jsc.number)
         ));

  });

  suite('Alt laws', function() {

    test('associativity',
         laws.Alt(Z.equals).associativity(
           MaybeArb(jsc.number),
           MaybeArb(jsc.number),
           MaybeArb(jsc.number)
         ));

    test('distributivity',
         laws.Alt(Z.equals).distributivity(
           MaybeArb(jsc.number),
           MaybeArb(jsc.number),
           jsc.constant(Math.sqrt)
         ));

  });

  suite('Plus laws', function() {

    test('left identity',
         laws.Plus(Z.equals, Maybe).leftIdentity(
           MaybeArb(jsc.number)
         ));

    test('right identity',
         laws.Plus(Z.equals, Maybe).rightIdentity(
           MaybeArb(jsc.number)
         ));

    test('annihilation',
         laws.Plus(Z.equals, Maybe).annihilation(
           jsc.constant(Math.sqrt)
         ));

  });

  suite('Alternative laws', function() {

    test('distributivity',
         laws.Alternative(Z.equals, Maybe).distributivity(
           MaybeArb(jsc.number),
           MaybeArb(jsc.constant(Math.sqrt)),
           MaybeArb(jsc.constant(Math.abs))
         ));

    test('annihilation',
         laws.Alternative(Z.equals, Maybe).annihilation(
           MaybeArb(jsc.number)
         ));

  });

  suite('Foldable laws', function() {

    test('associativity',
         laws.Foldable(Z.equals).associativity(
           jsc.constant(add_),
           jsc.number,
           MaybeArb(jsc.number)
         ));

  });

  suite('Traversable laws', function() {

    test('naturality',
         laws.Traversable(Z.equals).naturality(
           jsc.constant(Either),
           jsc.constant(Maybe),
           jsc.constant(eitherToMaybe),
           MaybeArb(EitherArb(jsc.string, jsc.number))
         ));

    test('identity',
         laws.Traversable(Z.equals).identity(
           jsc.constant(Identity),
           MaybeArb(jsc.number)
         ));

    test('composition',
         laws.Traversable(Z.equals).composition(
           jsc.constant(Identity),
           jsc.constant(Maybe),
           MaybeArb(IdentityArb(MaybeArb(jsc.number)))
         ));

  });

  suite('Extend laws', function() {

    test('associativity',
         laws.Extend(Z.equals).associativity(
           MaybeArb(jsc.integer),
           jsc.constant(function(maybe) { return maybe.value + 1; }),
           jsc.constant(function(maybe) { return maybe.value * maybe.value; })
         ));

  });

});
