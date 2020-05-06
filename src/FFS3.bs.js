'use strict';

var Pervasives = require("bs-platform/lib/js/pervasives.js");

function lookup(x, _env) {
  while(true) {
    var env = _env;
    if (env) {
      var match = env[0];
      if (x === match.vid) {
        return match.value;
      } else {
        _env = env[1];
        continue ;
      }
    } else {
      return ;
    }
  };
}

throw Pervasives.failwith("TODO");

exports.lookup = lookup;
exports.sorry = sorry;
exports.step = step;
exports.inject = inject;
exports.isFinal = isFinal;
exports.iterateMaybeAux = iterateMaybeAux;
exports.advance = advance;
exports.takeWhileInclusive = takeWhileInclusive;
exports.iterateMaybe = iterateMaybe;
exports.interpretTrace = interpretTrace;
exports.loading = loading;
/* sorry Not a pure module */
