'use strict';

var Z = require('sanctuary-type-classes');

var Identity = require('./Identity');
var value = require('./value');


//  IdentityArb :: Arbitrary a -> Arbitrary (Identity a)
module.exports = function IdentityArb(arb) {
  return arb.smap(Identity, value, Z.toString);
};
