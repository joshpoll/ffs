'use strict';

var $$Array = require("bs-platform/lib/js/array.js");
var React = require("react");
var Belt_MapString = require("bs-platform/lib/js/belt_MapString.js");
var Main$Sidewinder = require("sidewinder/src/Main.bs.js");
var Theia$Sidewinder = require("sidewinder/src/Theia.bs.js");
var Rectangle$Sidewinder = require("sidewinder/src/Rectangle.bs.js");
var Transform$Sidewinder = require("sidewinder/src/Transform.bs.js");

function hSeq(uid, flow, $staropt$star, nodes) {
  var gap = $staropt$star !== undefined ? $staropt$star : 0;
  return Theia$Sidewinder.seq(uid, flow, undefined, nodes, undefined, gap, /* LeftRight */2, /* () */0);
}

function vSeq(uid, flow, $staropt$star, nodes) {
  var gap = $staropt$star !== undefined ? $staropt$star : 0;
  return Theia$Sidewinder.seq(uid, flow, undefined, nodes, undefined, gap, /* UpDown */0, /* () */0);
}

function value(uid, flow, name, node) {
  return Theia$Sidewinder.box(uid, flow, /* :: */[
              name,
              /* [] */0
            ], 5, 5, node, /* [] */0, /* () */0);
}

function cell(uid, flow, name, node) {
  return Theia$Sidewinder.box(uid, flow, /* :: */[
              name,
              /* [] */0
            ], 5, 5, node, /* [] */0, /* () */0);
}

function empty(uid, flow, param) {
  return Theia$Sidewinder.atom(uid, flow, undefined, undefined, React.createElement(React.Fragment, undefined), Rectangle$Sidewinder.fromCenterPointSize(0, 0, 0, 0), /* () */0);
}

function highlight(uid, flow, $staropt$star, fill, node, links, param) {
  var tags = $staropt$star !== undefined ? $staropt$star : /* [] */0;
  var render = function (nodes, bbox, links) {
    return React.createElement(React.Fragment, undefined, React.createElement("rect", {
                    height: Rectangle$Sidewinder.height(bbox).toString(),
                    width: Rectangle$Sidewinder.width(bbox).toString(),
                    fill: fill,
                    x: Rectangle$Sidewinder.x1(bbox).toString(),
                    y: Rectangle$Sidewinder.y1(bbox).toString()
                  }), Theia$Sidewinder.defaultRender(nodes, links));
  };
  return Main$Sidewinder.make(/* :: */[
              "highlight",
              tags
            ], /* :: */[
              node,
              /* [] */0
            ], links, (function (param, bboxes, param$1) {
                return Belt_MapString.map(bboxes, (function (param) {
                              return Transform$Sidewinder.ident;
                            }));
              }), (function (bs) {
                return Rectangle$Sidewinder.union_list($$Array.to_list(Belt_MapString.valuesToArray(bs)));
              }), render, uid, flow, /* () */0);
}

function paren(x) {
  return hSeq(undefined, undefined, undefined, /* :: */[
              Theia$Sidewinder.str(undefined, undefined, undefined, "(", /* () */0),
              /* :: */[
                x,
                /* :: */[
                  Theia$Sidewinder.str(undefined, undefined, undefined, ")", /* () */0),
                  /* [] */0
                ]
              ]
            ]);
}

var hole = Theia$Sidewinder.atom(undefined, undefined, undefined, /* [] */0, React.createElement("rect", {
          height: "10",
          width: "10",
          fill: "red",
          x: "5",
          y: "5"
        }), Rectangle$Sidewinder.fromPointSize(0, 0, 10, 10), /* () */0);

exports.hSeq = hSeq;
exports.vSeq = vSeq;
exports.value = value;
exports.cell = cell;
exports.empty = empty;
exports.highlight = highlight;
exports.paren = paren;
exports.hole = hole;
/* hole Not a pure module */
