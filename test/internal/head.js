'use strict';

var Maybe = require('../..');

//  head :: Array a -> Maybe a
module.exports = function head(xs) {
  return xs.length > 0 ? Maybe.Just(xs[0]) : Maybe.Nothing;
};
