'use strict';

var List = require("bs-platform/lib/js/list.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var Theia$Sidewinder = require("sidewinder/src/Theia.bs.js");
var Rectangle$Sidewinder = require("sidewinder/src/Rectangle.bs.js");

function hSeq($staropt$star, nodes) {
  var gap = $staropt$star !== undefined ? $staropt$star : 0;
  return Theia$Sidewinder.seq(undefined, undefined, undefined, nodes, undefined, gap, /* LeftRight */2, /* () */0);
}

function vSeq($staropt$star, nodes) {
  var gap = $staropt$star !== undefined ? $staropt$star : 0;
  return Theia$Sidewinder.seq(undefined, undefined, undefined, nodes, undefined, gap, /* UpDown */0, /* () */0);
}

function value(name, node) {
  return Theia$Sidewinder.box(undefined, undefined, /* :: */[
              name,
              /* [] */0
            ], 5, 5, node, /* [] */0, /* () */0);
}

function cell(name, node) {
  return Theia$Sidewinder.box(undefined, undefined, /* :: */[
              name,
              /* [] */0
            ], 5, 5, node, /* [] */0, /* () */0);
}

function split(list, n) {
  var _i = n;
  var _acc = /* [] */0;
  var _l = list;
  while(true) {
    var l = _l;
    var acc = _acc;
    var i = _i;
    if (l) {
      if (i === 0) {
        return /* tuple */[
                List.rev(acc),
                l
              ];
      } else {
        _l = l[1];
        _acc = /* :: */[
          l[0],
          acc
        ];
        _i = i - 1 | 0;
        continue ;
      }
    } else {
      return /* tuple */[
              List.rev(acc),
              /* [] */0
            ];
    }
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

function paren(x) {
  return hSeq(undefined, /* :: */[
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

function vizAExp(ae) {
  switch (ae.tag | 0) {
    case /* Var */0 :
        return Theia$Sidewinder.str(undefined, undefined, undefined, ae[0], /* () */0);
    case /* App */1 :
        return hSeq(2, /* :: */[
                    paren(vizAExp(ae[0])),
                    /* :: */[
                      vizAExp(ae[1]),
                      /* [] */0
                    ]
                  ]);
    case /* Lam */2 :
        return vizLambda(ae[0]);
    case /* Num */3 :
        return Theia$Sidewinder.str(undefined, undefined, undefined, String(ae[0]), /* () */0);
    case /* Add */4 :
        return hSeq(2, /* :: */[
                    paren(vizAExp(ae[0])),
                    /* :: */[
                      Theia$Sidewinder.str(undefined, undefined, undefined, "+", /* () */0),
                      /* :: */[
                        paren(vizAExp(ae[1])),
                        /* [] */0
                      ]
                    ]
                  ]);
    case /* Bracket */5 :
        return hSeq(2, /* :: */[
                    Theia$Sidewinder.str(undefined, undefined, undefined, "{", /* () */0),
                    /* :: */[
                      vizExp(ae[0]),
                      /* :: */[
                        Theia$Sidewinder.str(undefined, undefined, undefined, "}", /* () */0),
                        /* [] */0
                      ]
                    ]
                  ]);
    
  }
}

function vizExp(e) {
  if (e.tag) {
    return vSeq(undefined, /* :: */[
                hSeq(2, /* :: */[
                      Theia$Sidewinder.str(undefined, undefined, undefined, "let", /* () */0),
                      /* :: */[
                        Theia$Sidewinder.str(undefined, undefined, undefined, e[0], /* () */0),
                        /* :: */[
                          Theia$Sidewinder.str(undefined, undefined, undefined, "=", /* () */0),
                          /* :: */[
                            vizAExp(e[1]),
                            /* :: */[
                              Theia$Sidewinder.str(undefined, undefined, undefined, "in", /* () */0),
                              /* [] */0
                            ]
                          ]
                        ]
                      ]
                    ]),
                /* :: */[
                  vizExp(e[2]),
                  /* [] */0
                ]
              ]);
  } else {
    return vizAExp(e[0]);
  }
}

function vizValue(v) {
  if (v.tag) {
    return value("closure", hSeq(undefined, List.map((function (n) {
                          return Theia$Sidewinder.box(undefined, undefined, undefined, undefined, undefined, n, /* [] */0, /* () */0);
                        }), /* :: */[
                        vizLambda(v[0]),
                        /* :: */[
                          vizEnv(v[1]),
                          /* [] */0
                        ]
                      ])));
  } else {
    return value("num", Theia$Sidewinder.str(undefined, undefined, undefined, String(v[0]), /* () */0));
  }
}

function vizEnv(e) {
  return Theia$Sidewinder.table(undefined, undefined, undefined, /* :: */[
              /* :: */[
                Theia$Sidewinder.str(undefined, undefined, undefined, "Id", /* () */0),
                /* :: */[
                  Theia$Sidewinder.str(undefined, undefined, undefined, "Val", /* () */0),
                  /* [] */0
                ]
              ],
              List.rev(List.map((function (param) {
                          return /* :: */[
                                  Theia$Sidewinder.str(undefined, undefined, undefined, param.vid, /* () */0),
                                  /* :: */[
                                    vizValue(param.value),
                                    /* [] */0
                                  ]
                                ];
                        }), e))
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
              }), 0, 0, /* LeftRight */2, /* UpDown */0, /* () */0);
}

function vizLambda(param) {
  return hSeq(undefined, /* :: */[
              Theia$Sidewinder.str(undefined, undefined, undefined, "\\" + (param.vid + "."), /* () */0),
              /* :: */[
                vizExp(param.exp),
                /* [] */0
              ]
            ]);
}

function vizCtxt(c) {
  switch (c.tag | 0) {
    case /* AppL */0 :
        var partial_arg_000 = vizAExp(c[1]);
        var partial_arg = /* :: */[
          partial_arg_000,
          /* [] */0
        ];
        var partial_arg$1 = 2;
        var partial_arg$2 = function (param) {
          return hSeq(partial_arg$1, param);
        };
        return (function (param) {
            return kont(partial_arg$2, partial_arg, 0, param);
          });
    case /* AppR */1 :
        var partial_arg_000$1 = vizValue(c[0]);
        var partial_arg$3 = /* :: */[
          partial_arg_000$1,
          /* [] */0
        ];
        var partial_arg$4 = 2;
        var partial_arg$5 = function (param) {
          return hSeq(partial_arg$4, param);
        };
        return (function (param) {
            return kont(partial_arg$5, partial_arg$3, 1, param);
          });
    case /* LetL */2 :
        var e2 = c[2];
        var x = c[0];
        return (function (hole) {
            return vSeq(undefined, /* :: */[
                        hSeq(2, insert(hole, /* :: */[
                                  Theia$Sidewinder.str(undefined, undefined, undefined, "let", /* () */0),
                                  /* :: */[
                                    Theia$Sidewinder.str(undefined, undefined, undefined, x, /* () */0),
                                    /* :: */[
                                      Theia$Sidewinder.str(undefined, undefined, undefined, "=", /* () */0),
                                      /* :: */[
                                        Theia$Sidewinder.str(undefined, undefined, undefined, "in", /* () */0),
                                        /* [] */0
                                      ]
                                    ]
                                  ]
                                ], 3)),
                        /* :: */[
                          vizExp(e2),
                          /* [] */0
                        ]
                      ]);
          });
    case /* AddL */3 :
        var partial_arg_000$2 = Theia$Sidewinder.str(undefined, undefined, undefined, "+", /* () */0);
        var partial_arg_001 = /* :: */[
          paren(vizAExp(c[1])),
          /* [] */0
        ];
        var partial_arg$6 = /* :: */[
          partial_arg_000$2,
          partial_arg_001
        ];
        var partial_arg$7 = 2;
        var partial_arg$8 = function (param) {
          return hSeq(partial_arg$7, param);
        };
        return (function (param) {
            return kont(partial_arg$8, partial_arg$6, 0, param);
          });
    case /* AddR */4 :
        var partial_arg_000$3 = paren(vizValue(c[0]));
        var partial_arg_001$1 = /* :: */[
          Theia$Sidewinder.str(undefined, undefined, undefined, "+", /* () */0),
          /* [] */0
        ];
        var partial_arg$9 = /* :: */[
          partial_arg_000$3,
          partial_arg_001$1
        ];
        var partial_arg$10 = 2;
        var partial_arg$11 = function (param) {
          return hSeq(partial_arg$10, param);
        };
        return (function (param) {
            return kont(partial_arg$11, partial_arg$9, 2, param);
          });
    
  }
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
        }), Rectangle$Sidewinder.fromPointSize(0, 0, 10, 10), /* () */0);

function vizFocus(f) {
  switch (f.tag | 0) {
    case /* AExp */0 :
        return vizAExp(f[0]);
    case /* Exp */1 :
        return vizExp(f[0]);
    case /* Value */2 :
        return vizValue(f[0]);
    
  }
}

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
    return Theia$Sidewinder.str(undefined, undefined, undefined, " ", /* () */0);
  }
}

function vizMachineState(param) {
  var match = param.frame;
  return hSeq(20, /* :: */[
              vSeq(5, /* :: */[
                    cell("env", vizEnv(match.env)),
                    /* :: */[
                      zipper(vizFocus(param.focus), List.map(vizCtxt, match.ctxts)),
                      /* [] */0
                    ]
                  ]),
              /* :: */[
                cell("stack", vizStack(param.stack)),
                /* [] */0
              ]
            ]);
}

exports.hSeq = hSeq;
exports.vSeq = vSeq;
exports.value = value;
exports.cell = cell;
exports.split = split;
exports.insert = insert;
exports.kont = kont;
exports.zipper = zipper;
exports.paren = paren;
exports.vizAExp = vizAExp;
exports.vizExp = vizExp;
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
