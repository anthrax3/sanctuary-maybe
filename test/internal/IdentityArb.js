'use strict';

var S = require('sanctuary');
var Z = require('sanctuary-type-classes');

var Identity = require('./Identity');


//  IdentityArb :: Arbitrary a -> Arbitrary (Identity a)
module.exports = function IdentityArb(arb) {
  return arb.smap(Identity, S.prop('value'), Z.toString);
};
