'use strict';

var List = require("bs-platform/lib/js/list.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var Theia$Sidewinder = require("sidewinder/src/Theia.bs.js");
var Rectangle$Sidewinder = require("sidewinder/src/Rectangle.bs.js");

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

function vizVid(param) {
  return Theia$Sidewinder.str(param[0], undefined, undefined, param[1], /* () */0);
}

function vizInt(param) {
  return Theia$Sidewinder.str(param[0], undefined, undefined, String(param[1]), /* () */0);
}

function envToList(param) {
  var e = param[1];
  if (e) {
    return /* :: */[
            e[0],
            envToList(e[1])
          ];
  } else {
    return /* [] */0;
  }
}

function ctxtsToList(param) {
  var c = param[1];
  if (c) {
    return /* :: */[
            c[0],
            ctxtsToList(c[1])
          ];
  } else {
    return /* [] */0;
  }
}

function vizAExp(param) {
  var ae = param[1];
  var ae_uid = param[0];
  switch (ae.tag | 0) {
    case /* Var */0 :
        return Theia$Sidewinder.noop(ae_uid, undefined, undefined, vizVid(ae[0]), /* [] */0, /* () */0);
    case /* App */1 :
        return hSeq(ae_uid, undefined, 2, /* :: */[
                    paren(vizAExp(ae[0])),
                    /* :: */[
                      vizAExp(ae[1]),
                      /* [] */0
                    ]
                  ]);
    case /* Lam */2 :
        return Theia$Sidewinder.noop(ae_uid, undefined, undefined, vizLambda(ae[0]), /* [] */0, /* () */0);
    case /* Num */3 :
        return Theia$Sidewinder.noop(ae_uid, undefined, undefined, vizInt(ae[0]), /* [] */0, /* () */0);
    case /* Add */4 :
        return hSeq(ae_uid, undefined, 2, /* :: */[
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
        return hSeq(ae_uid, undefined, 2, /* :: */[
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

function vizExp(param) {
  var e = param[1];
  var e_uid = param[0];
  if (e.tag) {
    var match = e[0];
    return vSeq(e_uid, undefined, undefined, /* :: */[
                hSeq(undefined, undefined, 2, /* :: */[
                      Theia$Sidewinder.str(undefined, undefined, undefined, "let", /* () */0),
                      /* :: */[
                        Theia$Sidewinder.str(match[0], undefined, undefined, match[1], /* () */0),
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
    return Theia$Sidewinder.noop(e_uid, undefined, undefined, vizAExp(e[0]), /* [] */0, /* () */0);
  }
}

function vizValue(param) {
  var v = param[1];
  var v_uid = param[0];
  if (v.tag) {
    return value(v_uid, undefined, "closure", hSeq(undefined, undefined, undefined, List.map((function (n) {
                          return Theia$Sidewinder.box(undefined, undefined, undefined, undefined, undefined, n, /* [] */0, /* () */0);
                        }), /* :: */[
                        vizLambda(v[0]),
                        /* :: */[
                          vizEnv(v[1]),
                          /* [] */0
                        ]
                      ])));
  } else {
    return value(v_uid, undefined, "num", vizInt(v[0]));
  }
}

function vizEnv(param) {
  var e_uid = param[0];
  return Theia$Sidewinder.table(e_uid, undefined, undefined, /* :: */[
              /* :: */[
                Theia$Sidewinder.str(undefined, undefined, undefined, "Id", /* () */0),
                /* :: */[
                  Theia$Sidewinder.str(undefined, undefined, undefined, "Val", /* () */0),
                  /* [] */0
                ]
              ],
              List.rev(List.map((function (param) {
                          return /* :: */[
                                  vizVid(param.vid),
                                  /* :: */[
                                    vizValue(param.value_uid),
                                    /* [] */0
                                  ]
                                ];
                        }), envToList(/* tuple */[
                            e_uid,
                            param[1]
                          ])))
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
  return hSeq(param.uid, undefined, undefined, /* :: */[
              Theia$Sidewinder.str(undefined, undefined, undefined, "\\", /* () */0),
              /* :: */[
                vizVid(param.vid),
                /* :: */[
                  Theia$Sidewinder.str(undefined, undefined, undefined, ".", /* () */0),
                  /* :: */[
                    vizExp(param.exp_uid),
                    /* [] */0
                  ]
                ]
              ]
            ]);
}

function vizCtxt(param) {
  var c = param[1];
  var c_uid = param[0];
  switch (c.tag | 0) {
    case /* AppL */0 :
        var partial_arg_000 = vizAExp(c[1]);
        var partial_arg = /* :: */[
          partial_arg_000,
          /* [] */0
        ];
        var arg = function (param) {
          var partial_arg = 2;
          var partial_arg$1 = c_uid;
          return (function (param$1) {
              return hSeq(partial_arg$1, param, partial_arg, param$1);
            });
        };
        var partial_arg$1 = function (eta) {
          return arg(undefined)(eta);
        };
        return (function (param) {
            return kont(partial_arg$1, partial_arg, 0, param);
          });
    case /* AppR */1 :
        var partial_arg_000$1 = vizValue(c[0]);
        var partial_arg$2 = /* :: */[
          partial_arg_000$1,
          /* [] */0
        ];
        var arg$1 = function (param) {
          var partial_arg = 2;
          var partial_arg$1 = c_uid;
          return (function (param$1) {
              return hSeq(partial_arg$1, param, partial_arg, param$1);
            });
        };
        var partial_arg$3 = function (eta) {
          return arg$1(undefined)(eta);
        };
        return (function (param) {
            return kont(partial_arg$3, partial_arg$2, 1, param);
          });
    case /* LetL */2 :
        var e2 = c[2];
        var x = c[0];
        return (function (hole) {
            return vSeq(c_uid, undefined, undefined, /* :: */[
                        hSeq(undefined, undefined, 2, insert(hole, /* :: */[
                                  Theia$Sidewinder.str(undefined, undefined, undefined, "let", /* () */0),
                                  /* :: */[
                                    vizVid(x),
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
        var partial_arg$4 = /* :: */[
          partial_arg_000$2,
          partial_arg_001
        ];
        var arg$2 = function (param) {
          var partial_arg = 2;
          var partial_arg$1 = c_uid;
          return (function (param$1) {
              return hSeq(partial_arg$1, param, partial_arg, param$1);
            });
        };
        var partial_arg$5 = function (eta) {
          return arg$2(undefined)(eta);
        };
        return (function (param) {
            return kont(partial_arg$5, partial_arg$4, 0, param);
          });
    case /* AddR */4 :
        var partial_arg_000$3 = paren(vizValue(c[0]));
        var partial_arg_001$1 = /* :: */[
          Theia$Sidewinder.str(undefined, undefined, undefined, "+", /* () */0),
          /* [] */0
        ];
        var partial_arg$6 = /* :: */[
          partial_arg_000$3,
          partial_arg_001$1
        ];
        var arg$3 = function (param) {
          var partial_arg = 2;
          var partial_arg$1 = c_uid;
          return (function (param$1) {
              return hSeq(partial_arg$1, param, partial_arg, param$1);
            });
        };
        var partial_arg$7 = function (eta) {
          return arg$3(undefined)(eta);
        };
        return (function (param) {
            return kont(partial_arg$7, partial_arg$6, 2, param);
          });
    
  }
}

function vizCtxts(cs) {
  return List.map(vizCtxt, ctxtsToList(cs));
}

var hole = Theia$Sidewinder.atom(undefined, undefined, undefined, /* [] */0, React.createElement("rect", {
          height: "10",
          width: "10",
          fill: "red",
          x: "5",
          y: "5"
        }), Rectangle$Sidewinder.fromPointSize(0, 0, 10, 10), /* () */0);

function vizFocus(param) {
  var f = param[1];
  var f_uid = param[0];
  switch (f.tag | 0) {
    case /* AExp */0 :
        return Theia$Sidewinder.noop(f_uid, undefined, undefined, vizAExp(f[0]), /* [] */0, /* () */0);
    case /* Exp */1 :
        return Theia$Sidewinder.noop(f_uid, undefined, undefined, vizExp(f[0]), /* [] */0, /* () */0);
    case /* Value */2 :
        return Theia$Sidewinder.noop(f_uid, undefined, undefined, vizValue(f[0]), /* [] */0, /* () */0);
    
  }
}

function vizFrame(param) {
  return vSeq(param.uid, undefined, undefined, /* :: */[
              vizEnv(param.env_uid),
              /* :: */[
                zipper(hole, List.map(vizCtxt, ctxtsToList(param.ctxts_uid))),
                /* [] */0
              ]
            ]);
}

function stackToList(param) {
  var s = param[1];
  if (s) {
    return /* :: */[
            s[0],
            stackToList(s[1])
          ];
  } else {
    return /* [] */0;
  }
}

function vizStack(param) {
  var fs = param[1];
  var s_uid = param[0];
  if (fs) {
    return vSeq(s_uid, undefined, undefined, List.map(vizFrame, stackToList(/* tuple */[
                        s_uid,
                        fs
                      ])));
  } else {
    return Theia$Sidewinder.str(s_uid, undefined, undefined, " ", /* () */0);
  }
}

function vizMachineState(param) {
  var match = param.frame;
  return hSeq(param.uid, undefined, 20, /* :: */[
              vSeq(undefined, undefined, 5, /* :: */[
                    cell(undefined, undefined, "env", vizEnv(match.env_uid)),
                    /* :: */[
                      zipper(vizFocus(param.focus_uid), List.map(vizCtxt, ctxtsToList(match.ctxts_uid))),
                      /* [] */0
                    ]
                  ]),
              /* :: */[
                cell(undefined, undefined, "stack", vizStack(param.stack_uid)),
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
exports.vizVid = vizVid;
exports.vizInt = vizInt;
exports.envToList = envToList;
exports.ctxtsToList = ctxtsToList;
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
exports.stackToList = stackToList;
exports.vizStack = vizStack;
exports.vizMachineState = vizMachineState;
/* hole Not a pure module */
