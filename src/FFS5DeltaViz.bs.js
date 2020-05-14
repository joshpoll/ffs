'use strict';

var List = require("bs-platform/lib/js/list.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var Belt_MapString = require("bs-platform/lib/js/belt_MapString.js");
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

function zipper_aux(focus, konts) {
  if (konts) {
    return Curry._1(konts[0], zipper_aux(focus, konts[1]));
  } else {
    return focus;
  }
}

function zipper(uid, flow, focus, konts) {
  return Theia$Sidewinder.noop(uid, flow, undefined, zipper_aux(focus, konts), /* [] */0, /* () */0);
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

function vizVid(flow, param) {
  var x_uid = param[0];
  return Theia$Sidewinder.str(x_uid, Belt_MapString.get(flow, x_uid), undefined, param[1], /* () */0);
}

function vizInt(flow, param) {
  var n_uid = param[0];
  return Theia$Sidewinder.str(n_uid, Belt_MapString.get(flow, n_uid), undefined, String(param[1]), /* () */0);
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

function vizAExp(flow, param) {
  var ae = param[1];
  var ae_uid = param[0];
  switch (ae.tag | 0) {
    case /* Var */0 :
        return Theia$Sidewinder.noop(ae_uid, Belt_MapString.get(flow, ae_uid), undefined, vizVid(flow, ae[0]), /* [] */0, /* () */0);
    case /* App */1 :
        return hSeq(ae_uid, Belt_MapString.get(flow, ae_uid), 2, /* :: */[
                    paren(vizAExp(flow, ae[0])),
                    /* :: */[
                      vizAExp(flow, ae[1]),
                      /* [] */0
                    ]
                  ]);
    case /* Lam */2 :
        return Theia$Sidewinder.noop(ae_uid, Belt_MapString.get(flow, ae_uid), undefined, vizLambda(flow, ae[0]), /* [] */0, /* () */0);
    case /* Num */3 :
        return Theia$Sidewinder.noop(ae_uid, Belt_MapString.get(flow, ae_uid), undefined, vizInt(flow, ae[0]), /* [] */0, /* () */0);
    case /* Add */4 :
        return hSeq(ae_uid, Belt_MapString.get(flow, ae_uid), 2, /* :: */[
                    paren(vizAExp(flow, ae[0])),
                    /* :: */[
                      Theia$Sidewinder.str(undefined, undefined, undefined, "+", /* () */0),
                      /* :: */[
                        paren(vizAExp(flow, ae[1])),
                        /* [] */0
                      ]
                    ]
                  ]);
    case /* Bracket */5 :
        return hSeq(ae_uid, Belt_MapString.get(flow, ae_uid), 2, /* :: */[
                    Theia$Sidewinder.str(undefined, undefined, undefined, "{", /* () */0),
                    /* :: */[
                      vizExp(flow, ae[0]),
                      /* :: */[
                        Theia$Sidewinder.str(undefined, undefined, undefined, "}", /* () */0),
                        /* [] */0
                      ]
                    ]
                  ]);
    
  }
}

function vizExp(flow, param) {
  var e = param[1];
  var e_uid = param[0];
  if (e.tag) {
    return vSeq(e_uid, Belt_MapString.get(flow, e_uid), undefined, /* :: */[
                hSeq(undefined, undefined, 2, /* :: */[
                      Theia$Sidewinder.str(undefined, undefined, undefined, "let", /* () */0),
                      /* :: */[
                        vizVid(flow, e[0]),
                        /* :: */[
                          Theia$Sidewinder.str(undefined, undefined, undefined, "=", /* () */0),
                          /* :: */[
                            vizAExp(flow, e[1]),
                            /* :: */[
                              Theia$Sidewinder.str(undefined, undefined, undefined, "in", /* () */0),
                              /* [] */0
                            ]
                          ]
                        ]
                      ]
                    ]),
                /* :: */[
                  vizExp(flow, e[2]),
                  /* [] */0
                ]
              ]);
  } else {
    return Theia$Sidewinder.noop(e_uid, Belt_MapString.get(flow, e_uid), undefined, vizAExp(flow, e[0]), /* [] */0, /* () */0);
  }
}

function vizValue(flow, param) {
  var v = param[1];
  var v_uid = param[0];
  if (v.tag) {
    return value(v_uid, Belt_MapString.get(flow, v_uid), "closure", hSeq(undefined, undefined, undefined, List.map((function (n) {
                          return Theia$Sidewinder.box(undefined, undefined, undefined, undefined, undefined, n, /* [] */0, /* () */0);
                        }), /* :: */[
                        vizLambda(flow, v[0]),
                        /* :: */[
                          vizEnv(flow, v[1]),
                          /* [] */0
                        ]
                      ])));
  } else {
    return value(v_uid, Belt_MapString.get(flow, v_uid), "num", vizInt(flow, v[0]));
  }
}

function vizEnv(flow, param) {
  var e_uid = param[0];
  return Theia$Sidewinder.table(e_uid, Belt_MapString.get(flow, e_uid), undefined, /* :: */[
              /* :: */[
                Theia$Sidewinder.str(undefined, undefined, undefined, "Id", /* () */0),
                /* :: */[
                  Theia$Sidewinder.str(undefined, undefined, undefined, "Val", /* () */0),
                  /* [] */0
                ]
              ],
              List.rev(List.map((function (param) {
                          return /* :: */[
                                  vizVid(flow, param.vid),
                                  /* :: */[
                                    vizValue(flow, param.value_uid),
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

function vizLambda(flow, param) {
  var uid = param.uid;
  return hSeq(uid, Belt_MapString.get(flow, uid), undefined, /* :: */[
              Theia$Sidewinder.str(undefined, undefined, undefined, "\\", /* () */0),
              /* :: */[
                vizVid(flow, param.vid),
                /* :: */[
                  Theia$Sidewinder.str(undefined, undefined, undefined, ".", /* () */0),
                  /* :: */[
                    vizExp(flow, param.exp_uid),
                    /* [] */0
                  ]
                ]
              ]
            ]);
}

function vizCtxt(flow, param) {
  var c = param[1];
  var c_uid = param[0];
  switch (c.tag | 0) {
    case /* AppL */0 :
        var partial_arg_000 = vizAExp(flow, c[1]);
        var partial_arg = /* :: */[
          partial_arg_000,
          /* [] */0
        ];
        var partial_arg$1 = 2;
        var partial_arg$2 = Belt_MapString.get(flow, c_uid);
        var partial_arg$3 = c_uid;
        var partial_arg$4 = function (param) {
          return hSeq(partial_arg$3, partial_arg$2, partial_arg$1, param);
        };
        return (function (param) {
            return kont(partial_arg$4, partial_arg, 0, param);
          });
    case /* AppR */1 :
        var partial_arg_000$1 = vizValue(flow, c[0]);
        var partial_arg$5 = /* :: */[
          partial_arg_000$1,
          /* [] */0
        ];
        var partial_arg$6 = 2;
        var partial_arg$7 = Belt_MapString.get(flow, c_uid);
        var partial_arg$8 = c_uid;
        var partial_arg$9 = function (param) {
          return hSeq(partial_arg$8, partial_arg$7, partial_arg$6, param);
        };
        return (function (param) {
            return kont(partial_arg$9, partial_arg$5, 1, param);
          });
    case /* LetL */2 :
        var e2 = c[2];
        var x = c[0];
        return (function (hole) {
            return vSeq(c_uid, Belt_MapString.get(flow, c_uid), undefined, /* :: */[
                        hSeq(undefined, undefined, 2, insert(hole, /* :: */[
                                  Theia$Sidewinder.str(undefined, undefined, undefined, "let", /* () */0),
                                  /* :: */[
                                    vizVid(flow, x),
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
                          vizExp(flow, e2),
                          /* [] */0
                        ]
                      ]);
          });
    case /* AddL */3 :
        var partial_arg_000$2 = Theia$Sidewinder.str(undefined, undefined, undefined, "+", /* () */0);
        var partial_arg_001 = /* :: */[
          paren(vizAExp(flow, c[1])),
          /* [] */0
        ];
        var partial_arg$10 = /* :: */[
          partial_arg_000$2,
          partial_arg_001
        ];
        var partial_arg$11 = 2;
        var partial_arg$12 = Belt_MapString.get(flow, c_uid);
        var partial_arg$13 = c_uid;
        var partial_arg$14 = function (param) {
          return hSeq(partial_arg$13, partial_arg$12, partial_arg$11, param);
        };
        return (function (param) {
            return kont(partial_arg$14, partial_arg$10, 0, param);
          });
    case /* AddR */4 :
        var partial_arg_000$3 = paren(vizValue(flow, c[0]));
        var partial_arg_001$1 = /* :: */[
          Theia$Sidewinder.str(undefined, undefined, undefined, "+", /* () */0),
          /* [] */0
        ];
        var partial_arg$15 = /* :: */[
          partial_arg_000$3,
          partial_arg_001$1
        ];
        var partial_arg$16 = 2;
        var partial_arg$17 = Belt_MapString.get(flow, c_uid);
        var partial_arg$18 = c_uid;
        var partial_arg$19 = function (param) {
          return hSeq(partial_arg$18, partial_arg$17, partial_arg$16, param);
        };
        return (function (param) {
            return kont(partial_arg$19, partial_arg$15, 2, param);
          });
    
  }
}

function vizCtxts(flow, cs) {
  return List.map((function (param) {
                return vizCtxt(flow, param);
              }), ctxtsToList(cs));
}

var hole = Theia$Sidewinder.atom(undefined, undefined, undefined, /* [] */0, React.createElement("rect", {
          height: "10",
          width: "10",
          fill: "red",
          x: "5",
          y: "5"
        }), Rectangle$Sidewinder.fromPointSize(0, 0, 10, 10), /* () */0);

function vizFocus(flow, param) {
  var f = param[1];
  var f_uid = param[0];
  switch (f.tag | 0) {
    case /* AExp */0 :
        return Theia$Sidewinder.noop(f_uid, Belt_MapString.get(flow, f_uid), undefined, vizAExp(flow, f[0]), /* [] */0, /* () */0);
    case /* Exp */1 :
        return Theia$Sidewinder.noop(f_uid, Belt_MapString.get(flow, f_uid), undefined, vizExp(flow, f[0]), /* [] */0, /* () */0);
    case /* Value */2 :
        return Theia$Sidewinder.noop(f_uid, Belt_MapString.get(flow, f_uid), undefined, vizValue(flow, f[0]), /* [] */0, /* () */0);
    
  }
}

function vizFrame(flow, param) {
  var uid = param.uid;
  return vSeq(uid, Belt_MapString.get(flow, uid), undefined, /* :: */[
              vizEnv(flow, param.env_uid),
              /* :: */[
                zipper(undefined, undefined, hole, vizCtxts(flow, param.ctxts_uid)),
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

function vizStack(flow, param) {
  var fs = param[1];
  var s_uid = param[0];
  if (fs) {
    return vSeq(s_uid, Belt_MapString.get(flow, s_uid), undefined, List.map((function (param) {
                      return vizFrame(flow, param);
                    }), stackToList(/* tuple */[
                        s_uid,
                        fs
                      ])));
  } else {
    return Theia$Sidewinder.str(s_uid, Belt_MapString.get(flow, s_uid), undefined, " ", /* () */0);
  }
}

function vizMachineState(param) {
  var match = param[1];
  var match$1 = match.zipper;
  var z_uid = match$1.uid;
  var uid = match.uid;
  var flow = param[0];
  return hSeq(uid, Belt_MapString.get(flow, uid), 20, /* :: */[
              vSeq(undefined, undefined, 5, /* :: */[
                    cell(undefined, undefined, "env", vizEnv(flow, match.env_uid)),
                    /* :: */[
                      zipper(z_uid, Belt_MapString.get(flow, z_uid), vizFocus(flow, match$1.focus_uid), vizCtxts(flow, match$1.ctxts_uid)),
                      /* [] */0
                    ]
                  ]),
              /* :: */[
                cell(undefined, undefined, "stack", vizStack(flow, match.stack_uid)),
                /* [] */0
              ]
            ]);
}

var MS = /* alias */0;

exports.MS = MS;
exports.hSeq = hSeq;
exports.vSeq = vSeq;
exports.value = value;
exports.cell = cell;
exports.split = split;
exports.insert = insert;
exports.kont = kont;
exports.zipper_aux = zipper_aux;
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