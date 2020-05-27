'use strict';

var $$Array = require("bs-platform/lib/js/array.js");
var React = require("react");
var Belt_MapString = require("bs-platform/lib/js/belt_MapString.js");
var Main$Sidewinder = require("sidewinder/src/Main.bs.js");
var Theia$Sidewinder = require("sidewinder/src/Theia.bs.js");
var Rectangle$Sidewinder = require("sidewinder/src/Rectangle.bs.js");
var Transform$Sidewinder = require("sidewinder/src/Transform.bs.js");

function hSeq(uid, flowTag, gapOpt, nodes) {
  var gap = gapOpt !== undefined ? gapOpt : 0;
  return Theia$Sidewinder.seq(uid, flowTag, undefined, nodes, undefined, gap, /* LeftRight */2, undefined);
}

function vSeq(uid, flowTag, gapOpt, nodes) {
  var gap = gapOpt !== undefined ? gapOpt : 0;
  return Theia$Sidewinder.seq(uid, flowTag, undefined, nodes, undefined, gap, /* UpDown */0, undefined);
}

function value(uid, flowTag, name, node) {
  return Theia$Sidewinder.box(uid, flowTag, /* :: */[
              name,
              /* [] */0
            ], 5, 5, node, /* [] */0, undefined);
}

function cell(uid, flowTag, name, node) {
  return Theia$Sidewinder.box(uid, flowTag, /* :: */[
              name,
              /* [] */0
            ], 5, 5, node, /* [] */0, undefined);
}

function empty(uid, flowTag, param) {
  return Theia$Sidewinder.atom(uid, flowTag, undefined, undefined, React.createElement(React.Fragment, undefined), Rectangle$Sidewinder.fromCenterPointSize(0, 0, 0, 0), undefined);
}

function highlight(uid, flowTag, tagsOpt, fill, node, links, param) {
  var tags = tagsOpt !== undefined ? tagsOpt : /* [] */0;
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
              }), render, uid, flowTag, undefined);
}

function paren(x) {
  return hSeq(undefined, undefined, undefined, /* :: */[
              Theia$Sidewinder.str(undefined, undefined, undefined, "(", undefined),
              /* :: */[
                x,
                /* :: */[
                  Theia$Sidewinder.str(undefined, undefined, undefined, ")", undefined),
                  /* [] */0
                ]
              ]
            ]);
}

var hole = Theia$Sidewinder.atom(undefined, undefined, undefined, /* [] */0, React.createElement("rect", {
          height: "10",
          width: "10",
          fill: "none",
          x: "5",
          y: "5"
        }), Rectangle$Sidewinder.fromPointSize(0, 0, 10, 10), undefined);

exports.hSeq = hSeq;
exports.vSeq = vSeq;
exports.value = value;
exports.cell = cell;
exports.empty = empty;
exports.highlight = highlight;
exports.paren = paren;
exports.hole = hole;
/* hole Not a pure module */
