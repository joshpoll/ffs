'use strict';


var counter = {
  contents: 0
};

function readAndUpdateCounter(param) {
  counter.contents = counter.contents + 1 | 0;
  return counter.contents - 1 | 0;
}

function rauc(param) {
  return String(readAndUpdateCounter(/* () */0));
}

function makeUIDConstructor(s, x) {
  return /* tuple */[
          s + ("_" + String(readAndUpdateCounter(/* () */0))),
          x
        ];
}

exports.counter = counter;
exports.readAndUpdateCounter = readAndUpdateCounter;
exports.rauc = rauc;
exports.makeUIDConstructor = makeUIDConstructor;
/* No side effect */
