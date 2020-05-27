'use strict';

var List = require("bs-platform/lib/js/list.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var Theia$Sidewinder = require("sidewinder/src/Theia.bs.js");
var Rectangle$Sidewinder = require("sidewinder/src/Rectangle.bs.js");

function hSeq(gapOpt, nodes) {
  var gap = gapOpt !== undefined ? gapOpt : 0;
  return Theia$Sidewinder.seq(undefined, undefined, undefined, nodes, undefined, gap, /* LeftRight */2, undefined);
}

function vSeq(gapOpt, nodes) {
  var gap = gapOpt !== undefined ? gapOpt : 0;
  return Theia$Sidewinder.seq(undefined, undefined, undefined, nodes, undefined, gap, /* UpDown */0, undefined);
}

function value(name, node) {
  return Theia$Sidewinder.box(undefined, undefined, /* :: */[
              name,
              /* [] */0
            ], 5, 5, node, /* [] */0, undefined);
}

function cell(name, node) {
  return Theia$Sidewinder.box(undefined, undefined, /* :: */[
              name,
              /* [] */0
            ], 5, 5, node, /* [] */0, undefined);
}

function split(list, n) {
  var _i = n;
  var _acc = /* [] */0;
  var _l = list;
  while(true) {
    var l = _l;
    var acc = _acc;
    var i = _i;
    if (!l) {
      return /* tuple */[
              List.rev(acc),
              /* [] */0
            ];
    }
    if (i === 0) {
      return /* tuple */[
              List.rev(acc),
              l
            ];
    }
    _l = l[1];
    _acc = /* :: */[
      l[0],
      acc
    ];
    _i = i - 1 | 0;
    continue ;
  };
}

function insert(x, xs, i) {
  var match = split(xs, i);
  return Pervasives.$at(match[0], /* :: */[
              x,
              match[1]
            ]);
}

function kont(nodeBuilder, nodes, holePos, hole) {
  return Curry._1(nodeBuilder, insert(hole, nodes, holePos));
}

function zipper(focus, konts) {
  if (konts) {
    return Curry._1(konts[0], zipper(focus, konts[1]));
  } else {
    return focus;
  }
}

function vizExpr(e) {
  switch (e.tag | 0) {
    case /* Var */0 :
        return Theia$Sidewinder.str(undefined, undefined, undefined, e[0], undefined);
    case /* App */1 :
        return hSeq(2, /* :: */[
                    hSeq(undefined, /* :: */[
                          Theia$Sidewinder.str(undefined, undefined, undefined, "(", undefined),
                          /* :: */[
                            vizExpr(e[0]),
                            /* :: */[
                              Theia$Sidewinder.str(undefined, undefined, undefined, ")", undefined),
                              /* [] */0
                            ]
                          ]
                        ]),
                    /* :: */[
                      vizExpr(e[1]),
                      /* [] */0
                    ]
                  ]);
    case /* Lam */2 :
        return vizLambda(e[0]);
    case /* Val */3 :
        return vizValue(e[0]);
    
  }
}

function vizValue(v) {
  return value("closure", hSeq(undefined, List.map((function (n) {
                        return Theia$Sidewinder.box(undefined, undefined, undefined, undefined, undefined, n, /* [] */0, undefined);
                      }), /* :: */[
                      vizLambda(v[0]),
                      /* :: */[
                        vizEnv(v[1]),
                        /* [] */0
                      ]
                    ])));
}

function vizEnv(e) {
  return Theia$Sidewinder.table(undefined, undefined, undefined, /* :: */[
              /* :: */[
                Theia$Sidewinder.str(undefined, undefined, undefined, "Id", undefined),
                /* :: */[
                  Theia$Sidewinder.str(undefined, undefined, undefined, "Val", undefined),
                  /* [] */0
                ]
              ],
              List.map((function (param) {
                      return /* :: */[
                              Theia$Sidewinder.str(undefined, undefined, undefined, param.id, undefined),
                              /* :: */[
                                vizValue(param.value),
                                /* [] */0
                              ]
                            ];
                    }), e)
            ], (function (source, target) {
                return React.createElement("line", {
                            stroke: "black",
                            x1: ((Rectangle$Sidewinder.x2(source) + Rectangle$Sidewinder.x1(target)) / 2).toString(),
                            x2: ((Rectangle$Sidewinder.x2(source) + Rectangle$Sidewinder.x1(target)) / 2).toString(),
                            y1: ((Rectangle$Sidewinder.y1(source) + Rectangle$Sidewinder.y1(target)) / 2).toString(),
                            y2: ((Rectangle$Sidewinder.y2(source) + Rectangle$Sidewinder.y2(target)) / 2).toString()
                          });
              }), (function (source, target) {
                return React.createElement("line", {
                            stroke: "black",
                            x1: ((Rectangle$Sidewinder.x1(source) + Rectangle$Sidewinder.x1(target)) / 2).toString(),
                            x2: ((Rectangle$Sidewinder.x2(source) + Rectangle$Sidewinder.x2(target)) / 2).toString(),
                            y1: ((Rectangle$Sidewinder.y2(source) + Rectangle$Sidewinder.y1(target)) / 2).toString(),
                            y2: ((Rectangle$Sidewinder.y2(source) + Rectangle$Sidewinder.y1(target)) / 2).toString()
                          });
              }), 0, 0, /* LeftRight */2, /* UpDown */0, undefined);
}

function vizLambda(param) {
  return hSeq(undefined, /* :: */[
              Theia$Sidewinder.str(undefined, undefined, undefined, "\\" + (param.id + "."), undefined),
              /* :: */[
                vizExpr(param.expr),
                /* [] */0
              ]
            ]);
}

function vizCtxt(c) {
  if (c.tag) {
    var partial_arg_000 = vizValue(c[0]);
    var partial_arg = /* :: */[
      partial_arg_000,
      /* [] */0
    ];
    var partial_arg$1 = function (eta) {
      return hSeq(undefined, eta);
    };
    return (function (param) {
        return kont(partial_arg$1, partial_arg, 1, param);
      });
  }
  var partial_arg_000$1 = vizExpr(c[1]);
  var partial_arg$2 = /* :: */[
    partial_arg_000$1,
    /* [] */0
  ];
  var partial_arg$3 = function (eta) {
    return hSeq(undefined, eta);
  };
  return (function (param) {
      return kont(partial_arg$3, partial_arg$2, 0, param);
    });
}

function vizCtxts(param) {
  return List.map(vizCtxt, param);
}

var hole = Theia$Sidewinder.atom(undefined, undefined, undefined, /* [] */0, React.createElement("rect", {
          height: "10",
          width: "10",
          fill: "red",
          x: "5",
          y: "5"
        }), Rectangle$Sidewinder.fromPointSize(0, 0, 10, 10), undefined);

function vizFrame(param) {
  return vSeq(undefined, /* :: */[
              vizEnv(param.env),
              /* :: */[
                zipper(hole, List.map(vizCtxt, param.ctxts)),
                /* [] */0
              ]
            ]);
}

function vizStack(fs) {
  if (fs) {
    return vSeq(undefined, List.map(vizFrame, fs));
  } else {
    return Theia$Sidewinder.str(undefined, undefined, undefined, " ", undefined);
  }
}

function vizMachineState(param) {
  var match = param.frame;
  return hSeq(20, /* :: */[
              vSeq(5, /* :: */[
                    cell("env", vizEnv(match.env)),
                    /* :: */[
                      zipper(vizExpr(param.focus), List.map(vizCtxt, match.ctxts)),
                      /* [] */0
                    ]
                  ]),
              /* :: */[
                cell("stack", vizStack(param.stack)),
                /* [] */0
              ]
            ]);
}

var vizFocus = vizExpr;

exports.hSeq = hSeq;
exports.vSeq = vSeq;
exports.value = value;
exports.cell = cell;
exports.split = split;
exports.insert = insert;
exports.kont = kont;
exports.zipper = zipper;
exports.vizExpr = vizExpr;
exports.vizValue = vizValue;
exports.vizEnv = vizEnv;
exports.vizLambda = vizLambda;
exports.vizCtxt = vizCtxt;
exports.vizCtxts = vizCtxts;
exports.hole = hole;
exports.vizFocus = vizFocus;
exports.vizFrame = vizFrame;
exports.vizStack = vizStack;
exports.vizMachineState = vizMachineState;
/* hole Not a pure module */
