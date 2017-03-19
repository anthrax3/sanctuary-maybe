'use strict';

var jsc = require('jsverify');
var Z = require('sanctuary-type-classes');

var Maybe = require('../..');

var value = require('./value');


//  MaybeArb :: Arbitrary a -> Arbitrary (Maybe a)
module.exports = function MaybeArb(arb) {
  return jsc.oneof(arb.smap(Maybe.Just, value, Z.toString),
                   jsc.constant(Maybe.Nothing));
};
