'use strict';

var Pervasives = require("bs-platform/lib/js/pervasives.js");
var Belt_MapString = require("bs-platform/lib/js/belt_MapString.js");

function merge(m1, m2) {
  return Belt_MapString.merge(m1, m2, (function (param, mv1, mv2) {
                if (mv1 !== undefined) {
                  var v1 = mv1;
                  if (mv2 !== undefined) {
                    return Pervasives.$at(v1, mv2);
                  } else {
                    return v1;
                  }
                } else if (mv2 !== undefined) {
                  return mv2;
                } else {
                  return ;
                }
              }));
}

var MS = /* alias */0;

var fromArray = Belt_MapString.fromArray;

var toArray = Belt_MapString.toArray;

var none = Belt_MapString.empty;

var get = Belt_MapString.get;

exports.MS = MS;
exports.merge = merge;
exports.fromArray = fromArray;
exports.toArray = toArray;
exports.none = none;
exports.get = get;
/* No side effect */
