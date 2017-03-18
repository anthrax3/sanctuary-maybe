'use strict';

var jsc = require('jsverify');

var M = require('../..');

var S = require('sanctuary');
var Z = require('sanctuary-type-classes');


//  MaybeArb :: Arbitrary a -> Arbitrary (Maybe a)
module.exports = function MaybeArb(arb) {
  return jsc.oneof(arb.smap(M.Just, S.prop('value'), Z.toString),
                   jsc.constant(M.Nothing));
};
