/*
    ,______  ______,  ,________,,_____,,_____,,__________  ,__________,
    |      \/      |  |        ||     ||     ||          \ |          |
    |_,          ,_|  |_      _||_    ||    _||_,   __    ||_,   _____|
      |   \  /   |     /      \   \   \/   /    |        /   |      |
    ,_|    ||    |_,,_/   /\   \_, \      /   ,_|   __   \ ,_|   ___|_,
    |      ||      ||     ||     |  |    |    |           ||          |
    |______||______||_____||_____|  |____|    |__________/ |__________|
                                                                         */

//. # sanctuary-maybe
//.
//. The Maybe type represents optional values: a value of type `Maybe a` is
//. either a Just whose value is of type `a` or Nothing (with no value).
//.
//. `Maybe a` satisfies the following [Fantasy Land][] specifications:
//.
//.   - [Setoid][]
//.   - [Semigroup][] and [Monoid][] (if `a` satisfies Semigroup)
//.   - [Functor][]
//.   - [Apply][]
//.   - [Applicative][]
//.   - [Chain][]
//.   - [Monad][]
//.   - [Alt][]
//.   - [Plus][]
//.   - [Alternative][]
//.   - [Foldable][]
//.   - [Traversable][]
//.   - [Extend][]

(function(f) {

  'use strict';

  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = f(require('sanctuary-type-classes'));
  } else if (typeof define === 'function' && define.amd != null) {
    define(['sanctuary-type-classes'], f);
  } else {
    self.sanctuaryMaybe = f(self.sanctuaryTypeClasses);
  }

}(function(Z) {

  'use strict';

  //# Maybe :: TypeRep Maybe
  //.
  //. The [type representative][] for the Maybe type.
  var Maybe = {prototype: _Maybe.prototype};

  Maybe.prototype.constructor = Maybe;

  function _Maybe(tag, value) {
    this.isNothing = tag === 'Nothing';
    this.isJust = tag === 'Just';
    if (this.isJust) this.value = value;

    //  Add "fantasy-land/concat" method conditionally so that Just('abc')
    //  satisfies the requirements of Semigroup but Just(123) does not.
    if (this.isNothing || Z.Semigroup.test(this.value)) {
      this['fantasy-land/concat'] = Maybe$prototype$concat;
    }
  }

  //# Nothing :: Maybe a
  //.
  //. Nothing.
  //.
  //. ```javascript
  //. > Maybe.Nothing
  //. Nothing
  //. ```
  var Nothing = Maybe.Nothing = new _Maybe('Nothing');

  //# Just :: a -> Maybe a
  //.
  //. Takes a value of any type and returns a Just with the given value.
  //.
  //. ```javascript
  //. > Maybe.Just(42)
  //. Just(42)
  //. ```
  function Just(x) {
    return new _Maybe('Just', x);
  }
  Maybe.Just = Just;

  //# Maybe.@@type :: String
  //.
  //. Maybe [type identifier][].
  //.
  //. ```javascript
  //. > Maybe['@@type']
  //. 'sanctuary/Maybe@1'
  //. ```
  Maybe['@@type'] = 'sanctuary/Maybe@1';

  //# Maybe.fantasy-land/empty :: () -> Maybe a
  //.
  //. Returns Nothing.
  //.
  //. ```javascript
  //. > Z.empty(Maybe)
  //. Nothing
  //. ```
  Maybe['fantasy-land/empty'] = function() { return Nothing; };

  //# Maybe.fantasy-land/of :: a -> Maybe a
  //.
  //. Takes a value of any type and returns a Just with the given value.
  //.
  //. ```javascript
  //. > Z.of(Maybe, 42)
  //. Just(42)
  //. ```
  Maybe['fantasy-land/of'] = Just;

  //# Maybe.fantasy-land/zero :: () -> Maybe a
  //.
  //. Returns Nothing.
  //.
  //. ```javascript
  //. > Z.zero(Maybe)
  //. Nothing
  //. ```
  Maybe['fantasy-land/zero'] = function() { return Nothing; };

  //# Maybe#isNothing :: Maybe a ~> Boolean
  //.
  //. `true` if `this` is Nothing; `false` if `this` is a Just.
  //.
  //. ```javascript
  //. > Maybe.Nothing.isNothing
  //. true
  //.
  //. > Maybe.Just(42).isNothing
  //. false
  //. ```

  //# Maybe#isJust :: Maybe a ~> Boolean
  //.
  //. `true` if `this` is a Just; `false` if `this` is Nothing.
  //.
  //. ```javascript
  //. > Maybe.Just(42).isJust
  //. true
  //.
  //. > Maybe.Nothing.isJust
  //. false
  //. ```

  //# Maybe#toString :: Maybe a ~> () -> String
  //.
  //. Returns the string representation of the Maybe.
  //.
  //. ```javascript
  //. > Z.toString(Maybe.Nothing)
  //. 'Nothing'
  //.
  //. > Z.toString(Maybe.Just([1, 2, 3]))
  //. 'Just([1, 2, 3])'
  //. ```
  Maybe.prototype.toString = function() {
    return this.isJust ? 'Just(' + Z.toString(this.value) + ')' : 'Nothing';
  };

  //# Maybe#inspect :: Maybe a ~> () -> String
  //.
  //. Returns the string representation of the Maybe. This method is used by
  //. `util.inspect` and the REPL to format a Maybe for display.
  //.
  //. See also [`Maybe#toString`][].
  //.
  //. ```javascript
  //. > Maybe.Nothing.inspect()
  //. 'Nothing'
  //.
  //. > Maybe.Just([1, 2, 3]).inspect()
  //. 'Just([1, 2, 3])'
  //. ```
  Maybe.prototype.inspect = function() { return this.toString(); };

  //# Maybe#fantasy-land/equals :: Maybe a ~> Maybe a -> Boolean
  //.
  //. Takes a value of the same type and returns `true` if:
  //.
  //.   - it is Nothing and `this` is Nothing; or
  //.
  //.   - it is a Just and `this` is a Just, and their values are equal
  //.     according to [`equals`](#equals).
  //.
  //. ```javascript
  //. > Z.equals(Maybe.Nothing, Maybe.Nothing)
  //. true
  //.
  //. > Z.equals(Maybe.Just([1, 2, 3]), Maybe.Just([1, 2, 3]))
  //. true
  //.
  //. > Z.equals(Maybe.Just([1, 2, 3]), Maybe.Just([3, 2, 1]))
  //. false
  //.
  //. > Z.equals(Maybe.Just([1, 2, 3]), Maybe.Nothing)
  //. false
  //. ```
  Maybe.prototype['fantasy-land/equals'] = function(other) {
    return this.isNothing ? other.isNothing
                          : other.isJust && Z.equals(other.value, this.value);
  };

  //# Maybe#fantasy-land/concat :: Semigroup a => Maybe a ~> Maybe a -> Maybe a
  //.
  //. Returns the result of concatenating two Maybe values of the same type.
  //. `a` must have a [Semigroup][].
  //.
  //. If `this` is Nothing and the argument is Nothing, this method returns
  //. Nothing.
  //.
  //. If `this` is a Just and the argument is a Just, this method returns a
  //. Just whose value is the result of concatenating this Just's value and
  //. the given Just's value.
  //.
  //. Otherwise, this method returns the Just.
  //.
  //. ```javascript
  //. > Z.concat(Maybe.Nothing, Maybe.Nothing)
  //. Nothing
  //.
  //. > Z.concat(Maybe.Just([1, 2, 3]), Maybe.Just([4, 5, 6]))
  //. Just([1, 2, 3, 4, 5, 6])
  //.
  //. > Z.concat(Maybe.Nothing, Maybe.Just([1, 2, 3]))
  //. Just([1, 2, 3])
  //.
  //. > Z.concat(Maybe.Just([1, 2, 3]), Maybe.Nothing)
  //. Just([1, 2, 3])
  //. ```
  function Maybe$prototype$concat(other) {
    return this.isNothing ?
      other :
      other.isNothing ? this : Just(Z.concat(this.value, other.value));
  }

  //# Maybe#fantasy-land/map :: Maybe a ~> (a -> b) -> Maybe b
  //.
  //. Takes a function and returns `this` if `this` is Nothing; otherwise
  //. it returns a Just whose value is the result of applying the function
  //. to this Just's value.
  //.
  //. ```javascript
  //. > Z.map(Math.sqrt, Maybe.Nothing)
  //. Nothing
  //.
  //. > Z.map(Math.sqrt, Maybe.Just(9))
  //. Just(3)
  //. ```
  Maybe.prototype['fantasy-land/map'] = function(f) {
    return this.isJust ? Just(f(this.value)) : this;
  };

  //# Maybe#fantasy-land/ap :: Maybe a ~> Maybe (a -> b) -> Maybe b
  //.
  //. Takes a Maybe and returns Nothing unless `this` is a Just *and* the
  //. argument is a Just, in which case it returns a Just whose value is
  //. the result of applying the given Just's value to this Just's value.
  //.
  //. ```javascript
  //. > Z.ap(Maybe.Nothing, Maybe.Nothing)
  //. Nothing
  //.
  //. > Z.ap(Maybe.Nothing, Maybe.Just(9))
  //. Nothing
  //.
  //. > Z.ap(Maybe.Just(Math.sqrt), Maybe.Nothing)
  //. Nothing
  //.
  //. > Z.ap(Maybe.Just(Math.sqrt), Maybe.Just(9))
  //. Just(3)
  //. ```
  Maybe.prototype['fantasy-land/ap'] = function(other) {
    return other.isJust ? Z.map(other.value, this) : other;
  };

  //# Maybe#fantasy-land/chain :: Maybe a ~> (a -> Maybe b) -> Maybe b
  //.
  //. Takes a function and returns `this` if `this` is Nothing; otherwise
  //. it returns the result of applying the function to this Just's value.
  //.
  //. ```javascript
  //. > function head(xs) {
  //. .   return xs.length > 0 ? Maybe.Just(xs[0]) : Maybe.Nothing;
  //. . }
  //.
  //. > Z.chain(head, Maybe.Nothing)
  //. Nothing
  //.
  //. > Z.chain(head, Maybe.Just([]))
  //. Nothing
  //.
  //. > Z.chain(head, Maybe.Just(['foo', 'bar', 'baz']))
  //. Just('foo')
  //. ```
  Maybe.prototype['fantasy-land/chain'] = function(f) {
    return this.isJust ? f(this.value) : this;
  };

  //# Maybe#fantasy-land/alt :: Maybe a ~> Maybe a -> Maybe a
  //.
  //. Chooses between `this` and the other Maybe provided as an argument.
  //. Returns `this` if `this` is a Just; the other Maybe otherwise.
  //.
  //. ```javascript
  //. > Z.alt(Maybe.Nothing, Maybe.Nothing)
  //. Nothing
  //.
  //. > Z.alt(Maybe.Nothing, Maybe.Just(1))
  //. Just(1)
  //.
  //. > Z.alt(Maybe.Just(2), Maybe.Nothing)
  //. Just(2)
  //.
  //. > Z.alt(Maybe.Just(3), Maybe.Just(4))
  //. Just(3)
  //. ```
  Maybe.prototype['fantasy-land/alt'] = function(other) {
    return this.isJust ? this : other;
  };

  //# Maybe#fantasy-land/reduce :: Maybe a ~> ((b, a) -> b, b) -> b
  //.
  //. Takes a function and an initial value of any type, and returns:
  //.
  //.   - the initial value if `this` is Nothing; otherwise
  //.
  //.   - the result of applying the function to the initial value and this
  //.     Just's value.
  //.
  //. ```javascript
  //. > Z.reduce(Math.pow, 10, Maybe.Nothing)
  //. 10
  //.
  //. > Z.reduce(Math.pow, 10, Maybe.Just(3))
  //. 1000
  //. ```
  Maybe.prototype['fantasy-land/reduce'] = function(f, x) {
    return this.isJust ? f(x, this.value) : x;
  };

  //# Maybe#fantasy-land/traverse :: Applicative f => Maybe a ~> (TypeRep f, a -> f b) -> f (Maybe b)
  //.
  //. Takes the type representative of some [Applicative][] and a function
  //. which returns a value of that Applicative, and returns:
  //.
  //.   - the result of applying the type representative's [`of`][] function to
  //.     `this` if `this` is Nothing; otherwise
  //.
  //.   - the result of mapping [`Just`](#Just) over the result of applying the
  //.     first function to this Just's value.
  //.
  //. ```javascript
  //. > Z.traverse(Array, s => s.split(' '), Maybe.Nothing)
  //. [Nothing]
  //.
  //. > Z.traverse(Array, s => s.split(' '), Maybe.Just('foo bar baz'))
  //. [Just('foo'), Just('bar'), Just('baz')]
  //. ```
  Maybe.prototype['fantasy-land/traverse'] = function(typeRep, f) {
    return this.isJust ? Z.map(Just, f(this.value)) : Z.of(typeRep, this);
  };

  //# Maybe#fantasy-land/extend :: Maybe a ~> (Maybe a -> b) -> Maybe b
  //.
  //. Takes a function and returns `this` if `this` is Nothing; otherwise
  //. it returns a Just whose value is the result of applying the function
  //. to `this`.
  //.
  //. ```javascript
  //. > Z.extend(x => x.value + 1, Maybe.Nothing)
  //. Nothing
  //.
  //. > Z.extend(x => x.value + 1, Maybe.Just(42))
  //. Just(43)
  //. ```
  Maybe.prototype['fantasy-land/extend'] = function(f) {
    return this.isJust ? Just(f(this)) : this;
  };

  return Maybe;

}));

//. [Alt]:                          v:fantasyland/fantasy-land#alt
//. [Alternative]:                  v:fantasyland/fantasy-land#alternative
//. [Applicative]:                  v:fantasyland/fantasy-land#applicative
//. [Apply]:                        v:fantasyland/fantasy-land#apply
//. [Chain]:                        v:fantasyland/fantasy-land#chain
//. [Extend]:                       v:fantasyland/fantasy-land#extend
//. [Fantasy Land]:                 v:fantasyland/fantasy-land
//. [Foldable]:                     v:fantasyland/fantasy-land#foldable
//. [Functor]:                      v:fantasyland/fantasy-land#functor
//. [Monad]:                        v:fantasyland/fantasy-land#monad
//. [Monoid]:                       v:fantasyland/fantasy-land#monoid
//. [Plus]:                         v:fantasyland/fantasy-land#plus
//. [Semigroup]:                    v:fantasyland/fantasy-land#semigroup
//. [Setoid]:                       v:fantasyland/fantasy-land#setoid
//. [Traversable]:                  v:fantasyland/fantasy-land#traversable
//. [`Maybe#toString`]:             #Maybe.prototype.toString
//. [`of`]:                         v:fantasyland/fantasy-land#of-method
//. [type identifier]:              https://github.com/sanctuary-js/sanctuary-type-identifiers
//. [type representative]:          https://sanctuary.js.org/#type-representatives
