//  ,______  ______,  ,________,,_____,,_____,,__________  ,__________,
//  |      \/      |  |        ||     ||     ||          \ |          |
//  |_,          ,_|  |_      _||_    ||    _||_,   __    ||_,   _____|
//    |   \  /   |     /      \   \   \/   /    |        /   |      |
//  ,_|    ||    |_,,_/   /\   \_, \      /   ,_|   __   \ ,_|   ___|_,
//  |      ||      ||     ||     |  |    |    |           ||          |
//  |______||______||_____||_____|  |____|    |__________/ |__________|

(function(f) {

  'use strict';

  /* istanbul ignore else */
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = f(require('sanctuary-def'),
                       require('sanctuary-type-classes'),
                       require('sanctuary-type-identifiers'));
  } else if (typeof define === 'function' && define.amd != null) {
    define(['sanctuary-def',
             'sanctuary-type-classes',
             'sanctuary-type-identifiers'],
           f);
  } else {
    self.sanctuary = f(self.sanctuaryDef,
                       self.sanctuaryTypeClasses,
                       self.sanctuaryTypeIdentifiers);
  }

}(function($, Z, type) {

  'use strict';

  //  typeEq :: String -> a -> Boolean
  function typeEq(typeIdent) {
    return function(x) {
      return type(x) === typeIdent;
    };
  }


  //  readmeUrl :: String -> String
  function readmeUrl(id) {
    var version = '0.0.0';  // updated programmatically
    return 'https://github.com/sanctuary-js/sanctuary-maybe/tree/v' + version +
           '#' + id;
  }

  //  :: Type
  var a = $.TypeVariable('a');

  //  maybeTypeIdent :: String
  var maybeTypeIdent = 'sanctuary/Maybe';

  //  $Maybe :: Type -> Type
  var $Maybe = $.UnaryType(
    maybeTypeIdent,
    readmeUrl('MaybeType'),
    typeEq(maybeTypeIdent),
    function(maybe) { return maybe.isJust ? [maybe.value] : []; }
  );

  //  defaultEnv :: Array Type
  var env = Z.concat($.env, [
    $Maybe
  ]);

  /* eslint-disable indent */

  var M = {};

  var def = $.create({checkTypes: true, env: env});

  //. ### Maybe type
  //.
  //. The Maybe type represents optional values: a value of type `Maybe a` is
  //. either a Just whose value is of type `a` or Nothing (with no value).
  //.
  //. The Maybe type satisfies the [Setoid][], [Monoid][], [Monad][],
  //. [Alternative][], [Traversable][], and [Extend][] specifications.

  //# MaybeType :: Type -> Type
  //.
  //. A [`UnaryType`][UnaryType] for use with [sanctuary-def][].
  M.MaybeType = $Maybe;

  //# Maybe :: TypeRep Maybe
  //.
  //. The [type representative](#type-representatives) for the Maybe type.
  var Maybe = M.Maybe = {prototype: _Maybe.prototype};

  Maybe.prototype.constructor = Maybe;

  function _Maybe(tag, value) {
    this.isNothing = tag === 'Nothing';
    this.isJust = tag === 'Just';
    if (this.isJust) this.value = value;
  }

  //# Nothing :: Maybe a
  //.
  //. Nothing.
  //.
  //. ```javascript
  //. > S.Nothing
  //. Nothing
  //. ```
  var Nothing = M.Nothing = new _Maybe('Nothing');

  //# Just :: a -> Maybe a
  //.
  //. Takes a value of any type and returns a Just with the given value.
  //.
  //. ```javascript
  //. > S.Just(42)
  //. Just(42)
  //. ```
  function Just(x) {
    return new _Maybe('Just', x);
  }
  M.Just = def('Just', {}, [a, $Maybe(a)], Just);

  //# Maybe.@@type :: String
  //.
  //. Maybe type identifier, `'sanctuary/Maybe'`.
  Maybe['@@type'] = maybeTypeIdent;

  //# Maybe.fantasy-land/empty :: () -> Maybe a
  //.
  //. Returns Nothing.
  //.
  //. ```javascript
  //. > S.empty(S.Maybe)
  //. Nothing
  //. ```
  Maybe['fantasy-land/empty'] = function() { return Nothing; };

  //# Maybe.fantasy-land/of :: a -> Maybe a
  //.
  //. Takes a value of any type and returns a Just with the given value.
  //.
  //. ```javascript
  //. > S.of(S.Maybe, 42)
  //. Just(42)
  //. ```
  Maybe['fantasy-land/of'] = Just;

  //# Maybe.fantasy-land/zero :: () -> Maybe a
  //.
  //. Returns Nothing.
  //.
  //. ```javascript
  //. > S.zero(S.Maybe)
  //. Nothing
  //. ```
  Maybe['fantasy-land/zero'] = function() { return Nothing; };

  //# Maybe#isNothing :: Maybe a ~> Boolean
  //.
  //. `true` if `this` is Nothing; `false` if `this` is a Just.
  //.
  //. ```javascript
  //. > S.Nothing.isNothing
  //. true
  //.
  //. > S.Just(42).isNothing
  //. false
  //. ```

  //# Maybe#isJust :: Maybe a ~> Boolean
  //.
  //. `true` if `this` is a Just; `false` if `this` is Nothing.
  //.
  //. ```javascript
  //. > S.Just(42).isJust
  //. true
  //.
  //. > S.Nothing.isJust
  //. false
  //. ```

  //# Maybe#toString :: Maybe a ~> () -> String
  //.
  //. Returns the string representation of the Maybe.
  //.
  //. ```javascript
  //. > S.toString(S.Nothing)
  //. 'Nothing'
  //.
  //. > S.toString(S.Just([1, 2, 3]))
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
  //. > S.Nothing.inspect()
  //. 'Nothing'
  //.
  //. > S.Just([1, 2, 3]).inspect()
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
  //. > S.equals(S.Nothing, S.Nothing)
  //. true
  //.
  //. > S.equals(S.Just([1, 2, 3]), S.Just([1, 2, 3]))
  //. true
  //.
  //. > S.equals(S.Just([1, 2, 3]), S.Just([3, 2, 1]))
  //. false
  //.
  //. > S.equals(S.Just([1, 2, 3]), S.Nothing)
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
  //. > S.concat(S.Nothing, S.Nothing)
  //. Nothing
  //.
  //. > S.concat(S.Just([1, 2, 3]), S.Just([4, 5, 6]))
  //. Just([1, 2, 3, 4, 5, 6])
  //.
  //. > S.concat(S.Nothing, S.Just([1, 2, 3]))
  //. Just([1, 2, 3])
  //.
  //. > S.concat(S.Just([1, 2, 3]), S.Nothing)
  //. Just([1, 2, 3])
  //. ```
  Maybe.prototype['fantasy-land/concat'] = function(other) {
    return this.isNothing ?
      other :
      other.isNothing ? this : Just(Z.concat(this.value, other.value));
  };

  //# Maybe#fantasy-land/map :: Maybe a ~> (a -> b) -> Maybe b
  //.
  //. Takes a function and returns `this` if `this` is Nothing; otherwise
  //. it returns a Just whose value is the result of applying the function
  //. to this Just's value.
  //.
  //. ```javascript
  //. > S.map(Math.sqrt, S.Nothing)
  //. Nothing
  //.
  //. > S.map(Math.sqrt, S.Just(9))
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
  //. > S.ap(S.Nothing, S.Nothing)
  //. Nothing
  //.
  //. > S.ap(S.Nothing, S.Just(9))
  //. Nothing
  //.
  //. > S.ap(S.Just(Math.sqrt), S.Nothing)
  //. Nothing
  //.
  //. > S.ap(S.Just(Math.sqrt), S.Just(9))
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
  //. > S.chain(S.parseFloat, S.Nothing)
  //. Nothing
  //.
  //. > S.chain(S.parseFloat, S.Just('xxx'))
  //. Nothing
  //.
  //. > S.chain(S.parseFloat, S.Just('12.34'))
  //. Just(12.34)
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
  //. > S.alt(S.Nothing, S.Nothing)
  //. Nothing
  //.
  //. > S.alt(S.Nothing, S.Just(1))
  //. Just(1)
  //.
  //. > S.alt(S.Just(2), S.Nothing)
  //. Just(2)
  //.
  //. > S.alt(S.Just(3), S.Just(4))
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
  //. > S.reduce_(Math.pow, 10, S.Nothing)
  //. 10
  //.
  //. > S.reduce_(Math.pow, 10, S.Just(3))
  //. 1000
  //. ```
  Maybe.prototype['fantasy-land/reduce'] = function(f, x) {
    return this.isJust ? f(x, this.value) : x;
  };

  //# Maybe#fantasy-land/traverse :: Applicative f => Maybe a ~> (TypeRep f, a -> f b) -> f (Maybe b)
  //.
  //. Takes two functions which both return values of the same [Applicative][],
  //. (the second of which must be that type's [`of`][] function) and returns:
  //.
  //.   - the result of applying `of` to `this` if `this` is Nothing; otherwise
  //.
  //.   - the result of mapping [`Just`](#Just) over the result of applying the
  //.     first function to this Just's value.
  //.
  //. ```javascript
  //. > S.traverse(Array, S.words, S.Nothing)
  //. [Nothing]
  //.
  //. > S.traverse(Array, S.words, S.Just('foo bar baz'))
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
  //. > S.extend(x => x.value + 1, S.Nothing)
  //. Nothing
  //.
  //. > S.extend(x => x.value + 1, S.Just(42))
  //. Just(43)
  //. ```
  Maybe.prototype['fantasy-land/extend'] = function(f) {
    return this.isJust ? Just(f(this)) : this;
  };

  return M;
}));

//. [$.Array]:          v:sanctuary-js/sanctuary-def#Array
//. [$.String]:         v:sanctuary-js/sanctuary-def#String
//. [Alt]:              v:fantasyland/fantasy-land#alt
//. [Alternative]:      v:fantasyland/fantasy-land#alternative
//. [Applicative]:      v:fantasyland/fantasy-land#applicative
//. [Apply]:            v:fantasyland/fantasy-land#apply
//. [Bifunctor]:        v:fantasyland/fantasy-land#bifunctor
//. [BinaryType]:       v:sanctuary-js/sanctuary-def#BinaryType
//. [Either]:           #either-type
//. [Extend]:           v:fantasyland/fantasy-land#extend
//. [Fantasy Land]:     v:fantasyland/fantasy-land
//. [Foldable]:         v:fantasyland/fantasy-land#foldable
//. [Functor]:          v:fantasyland/fantasy-land#functor
//. [Maybe]:            #maybe-type
//. [Monad]:            v:fantasyland/fantasy-land#monad
//. [Monoid]:           v:fantasyland/fantasy-land#monoid
//. [Nullable]:         v:sanctuary-js/sanctuary-def#Nullable
//. [Object#toString]:  https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
//. [Ramda]:            http://ramdajs.com/
//. [RegexFlags]:       v:sanctuary-js/sanctuary-def#RegexFlags
//. [Semigroup]:        v:fantasyland/fantasy-land#semigroup
//. [Setoid]:           v:fantasyland/fantasy-land#setoid
//. [Traversable]:      v:fantasyland/fantasy-land#traversable
//. [UnaryType]:        v:sanctuary-js/sanctuary-def#UnaryType
//. [`Z.alt`]:          v:sanctuary-js/sanctuary-type-classes#alt
//. [`Z.ap`]:           v:sanctuary-js/sanctuary-type-classes#ap
//. [`Z.apFirst`]:      v:sanctuary-js/sanctuary-type-classes#apFirst
//. [`Z.apSecond`]:     v:sanctuary-js/sanctuary-type-classes#apSecond
//. [`Z.bimap`]:        v:sanctuary-js/sanctuary-type-classes#bimap
//. [`Z.chain`]:        v:sanctuary-js/sanctuary-type-classes#chain
//. [`Z.chainRec`]:     v:sanctuary-js/sanctuary-type-classes#chainRec
//. [`Z.concat`]:       v:sanctuary-js/sanctuary-type-classes#concat
//. [`Z.empty`]:        v:sanctuary-js/sanctuary-type-classes#empty
//. [`Z.equals`]:       v:sanctuary-js/sanctuary-type-classes#equals
//. [`Z.extend`]:       v:sanctuary-js/sanctuary-type-classes#extend
//. [`Z.extract`]:      v:sanctuary-js/sanctuary-type-classes#extract
//. [`Z.filter`]:       v:sanctuary-js/sanctuary-type-classes#filter
//. [`Z.filterM`]:      v:sanctuary-js/sanctuary-type-classes#filterM
//. [`Z.join`]:         v:sanctuary-js/sanctuary-type-classes#join
//. [`Z.map`]:          v:sanctuary-js/sanctuary-type-classes#map
//. [`Z.of`]:           v:sanctuary-js/sanctuary-type-classes#of
//. [`Z.promap`]:       v:sanctuary-js/sanctuary-type-classes#promap
//. [`Z.sequence`]:     v:sanctuary-js/sanctuary-type-classes#sequence
//. [`Z.toString`]:     v:sanctuary-js/sanctuary-type-classes#toString
//. [`Z.traverse`]:     v:sanctuary-js/sanctuary-type-classes#traverse
//. [`Z.zero`]:         v:sanctuary-js/sanctuary-type-classes#zero
//. [`of`]:             v:fantasyland/fantasy-land#of-method
//. [parseInt]:         https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
//. [sanctuary-def]:    v:sanctuary-js/sanctuary-def
//. [thrush]:           https://github.com/raganwald-deprecated/homoiconic/blob/master/2008-10-30/thrush.markdown
//. [type identifier]:  v:sanctuary-js/sanctuary-type-identifiers
//.
//. [`Either#fantasy-land/bimap`]:      #Either.prototype.fantasy-land/bimap
//. [`Either#fantasy-land/map`]:        #Either.prototype.fantasy-land/map
//. [`Either#toString`]:                #Either.prototype.toString
//. [`Maybe#toString`]:                 #Maybe.prototype.toString
