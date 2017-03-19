'use strict';

var jsc = require('jsverify');
var Either = require('sanctuary-either');
var Z = require('sanctuary-type-classes');

var value = require('./value');


//  EitherArb :: Arbitrary a -> Arbitrary b -> Arbitrary (Either a b)
module.exports = function EitherArb(lArb, rArb) {
  return jsc.oneof(lArb.smap(Either.Left, value, Z.toString),
                   rArb.smap(Either.Right, value, Z.toString));
};
