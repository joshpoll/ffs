'use strict';

var List = require("bs-platform/lib/js/list.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var Belt_MapString = require("bs-platform/lib/js/belt_MapString.js");
var Theia$Sidewinder = require("sidewinder/src/Theia.bs.js");
var Flow$ReasonReactExamples = require("./Flow.bs.js");
var TheiaExtensions$ReasonReactExamples = require("./TheiaExtensions.bs.js");

function vizVid(flow, param) {
  var uid = param[0];
  return Theia$Sidewinder.str(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, param[1], /* () */0);
}

function vizInt(flow, param) {
  var uid = param[0];
  return Theia$Sidewinder.str(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, String(param[1]), /* () */0);
}

function vizZExp(vizOp, flow, param) {
  var match = param[1];
  var uid = param[0];
  return Theia$Sidewinder.noop(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, Curry._3(vizOp, flow, match.op, vizAExps(flow, match.args)), /* [] */0, /* () */0);
}

function vizAExps(flow, param) {
  var aexps = param[1];
  if (aexps) {
    return /* :: */[
            vizZExp(vizOp, flow, aexps[0]),
            vizAExps(flow, aexps[1])
          ];
  } else {
    return /* [] */0;
  }
}

function vizValues(flow, values) {
  var _acc = /* [] */0;
  var _param = values;
  while(true) {
    var param = _param;
    var acc = _acc;
    var values$1 = param[1];
    if (values$1) {
      _param = values$1[1];
      _acc = /* :: */[
        vizValue(flow, values$1[0]),
        acc
      ];
      continue ;
    } else {
      return acc;
    }
  };
}

function vizZCtxt(vizOp, flow, param, hole) {
  var match = param[1];
  var uid = param[0];
  return Theia$Sidewinder.noop(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, Curry._3(vizOp, flow, match.op, Pervasives.$at(vizAExps(flow, match.args), /* :: */[
                      hole,
                      vizValues(flow, match.values)
                    ])), /* [] */0, /* () */0);
}

function vizCtxts(flow, param) {
  var ctxts = param[1];
  if (ctxts) {
    var ctxts$1 = ctxts[1];
    var ctxt = ctxts[0];
    return (function (hole) {
        return vizCtxts(flow, ctxts$1)(vizZCtxt(vizOp, flow, ctxt, hole));
      });
  } else {
    return (function (x) {
        return x;
      });
  }
}

function vizOp(flow, param, inputs) {
  var op = param[1];
  var uid = param[0];
  if (op.tag) {
    return Theia$Sidewinder.noop(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, vizAExpOp(flow, op[0], inputs), /* [] */0, /* () */0);
  } else {
    return Theia$Sidewinder.noop(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, vizExpOp(flow, op[0], inputs), /* [] */0, /* () */0);
  }
}

function vizEnv(flow, param) {
  var env = param[1];
  var uid = param[0];
  if (env) {
    return TheiaExtensions$ReasonReactExamples.vSeq(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, /* :: */[
                vizEnv(flow, env[1]),
                /* :: */[
                  vizBinding(flow, env[0]),
                  /* [] */0
                ]
              ]);
  } else {
    return Theia$Sidewinder.str(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, "empty env", /* () */0);
  }
}

function vizValue(flow, param) {
  var value = param[1];
  var uid = param[0];
  if (value.tag) {
    return TheiaExtensions$ReasonReactExamples.value(uid, Flow$ReasonReactExamples.get(flow, uid), "closure", TheiaExtensions$ReasonReactExamples.hSeq(undefined, undefined, undefined, List.map((function (n) {
                          return Theia$Sidewinder.box(undefined, undefined, undefined, undefined, undefined, n, /* [] */0, /* () */0);
                        }), /* :: */[
                        vizLambda(flow, value[0]),
                        /* :: */[
                          vizEnv(flow, value[1]),
                          /* [] */0
                        ]
                      ])));
  } else {
    return TheiaExtensions$ReasonReactExamples.value(uid, Flow$ReasonReactExamples.get(flow, uid), "num", vizInt(flow, value[0]));
  }
}

function vizZPreVal(vizOp, flow, param) {
  var match = param[1];
  var uid = param[0];
  return Theia$Sidewinder.noop(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, Curry._3(vizOp, flow, match.op, vizValues(flow, match.values)), /* [] */0, /* () */0);
}

function vizFrame(flow, param) {
  var match = param[1];
  var uid = param[0];
  return TheiaExtensions$ReasonReactExamples.vSeq(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, /* :: */[
              vizEnv(flow, match.env),
              /* :: */[
                vizCtxts(flow, match.ctxts)(TheiaExtensions$ReasonReactExamples.hole),
                /* [] */0
              ]
            ]);
}

function vizStack(flow, param) {
  var stack = param[1];
  var uid = param[0];
  if (stack) {
    return TheiaExtensions$ReasonReactExamples.vSeq(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, /* :: */[
                vizStack(flow, stack[1]),
                /* :: */[
                  vizFrame(flow, stack[0]),
                  /* [] */0
                ]
              ]);
  } else {
    return Theia$Sidewinder.str(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, "empty stack", /* () */0);
  }
}

function vizBinding(flow, param) {
  var match = param[1];
  var uid = param[0];
  return TheiaExtensions$ReasonReactExamples.hSeq(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, /* :: */[
              vizVid(flow, match.vid),
              /* :: */[
                vizValue(flow, match.value),
                /* [] */0
              ]
            ]);
}

function vizLambda(flow, param) {
  var match = param[1];
  var uid = param[0];
  return TheiaExtensions$ReasonReactExamples.hSeq(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, /* :: */[
              Theia$Sidewinder.str(undefined, undefined, undefined, "\\", /* () */0),
              /* :: */[
                vizVid(flow, match.vid),
                /* :: */[
                  Theia$Sidewinder.str(undefined, undefined, undefined, ".", /* () */0),
                  /* :: */[
                    vizZExp(vizOp, flow, match.exp),
                    /* [] */0
                  ]
                ]
              ]
            ]);
}

function vizExpOp(flow, param, inputs) {
  var exp_op = param[1];
  var uid = param[0];
  if (exp_op.tag) {
    if (inputs) {
      if (inputs[1]) {
        return Pervasives.failwith("op Let expected input arity 1, but got " + String(List.length(inputs)));
      } else {
        return TheiaExtensions$ReasonReactExamples.vSeq(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, /* :: */[
                    TheiaExtensions$ReasonReactExamples.hSeq(undefined, undefined, 2, /* :: */[
                          Theia$Sidewinder.str(undefined, undefined, undefined, "let", /* () */0),
                          /* :: */[
                            vizVid(flow, exp_op[0]),
                            /* :: */[
                              Theia$Sidewinder.str(undefined, undefined, undefined, "=", /* () */0),
                              /* :: */[
                                inputs[0],
                                /* :: */[
                                  Theia$Sidewinder.str(undefined, undefined, undefined, "in", /* () */0),
                                  /* [] */0
                                ]
                              ]
                            ]
                          ]
                        ]),
                    /* :: */[
                      vizZExp(vizOp, flow, exp_op[1]),
                      /* [] */0
                    ]
                  ]);
      }
    } else {
      return Pervasives.failwith("op Let expected input arity 1, but got " + String(List.length(inputs)));
    }
  } else if (inputs) {
    return Pervasives.failwith("op Lift expected input arity 0, but got " + String(List.length(inputs)));
  } else {
    return Theia$Sidewinder.noop(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, vizZExp(vizOp, flow, exp_op[0]), /* [] */0, /* () */0);
  }
}

function vizAExpOp(flow, param, inputs) {
  var aexp_op = param[1];
  var uid = param[0];
  if (typeof aexp_op === "number") {
    if (aexp_op === /* App */0) {
      if (inputs) {
        var match = inputs[1];
        if (match && !match[1]) {
          return TheiaExtensions$ReasonReactExamples.hSeq(uid, Flow$ReasonReactExamples.get(flow, uid), 2, /* :: */[
                      TheiaExtensions$ReasonReactExamples.paren(inputs[0]),
                      /* :: */[
                        TheiaExtensions$ReasonReactExamples.paren(match[0]),
                        /* [] */0
                      ]
                    ]);
        }
        
      }
      return Pervasives.failwith("op App expected input arity 2, but got " + String(List.length(inputs)));
    } else {
      if (inputs) {
        var match$1 = inputs[1];
        if (match$1 && !match$1[1]) {
          return TheiaExtensions$ReasonReactExamples.hSeq(uid, Flow$ReasonReactExamples.get(flow, uid), 2, /* :: */[
                      TheiaExtensions$ReasonReactExamples.paren(inputs[0]),
                      /* :: */[
                        Theia$Sidewinder.str(undefined, undefined, undefined, "+", /* () */0),
                        /* :: */[
                          TheiaExtensions$ReasonReactExamples.paren(match$1[0]),
                          /* [] */0
                        ]
                      ]
                    ]);
        }
        
      }
      return Pervasives.failwith("op Add expected input arity 2, but got " + String(List.length(inputs)));
    }
  } else {
    switch (aexp_op.tag | 0) {
      case /* Var */0 :
          if (inputs) {
            return Pervasives.failwith("op Var expected input arity 0, but got " + String(List.length(inputs)));
          } else {
            return Theia$Sidewinder.noop(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, vizVid(flow, aexp_op[0]), /* [] */0, /* () */0);
          }
      case /* Lam */1 :
          if (inputs) {
            return Pervasives.failwith("op Lam expected input arity 0, but got " + String(List.length(inputs)));
          } else {
            return Theia$Sidewinder.noop(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, vizLambda(flow, aexp_op[0]), /* [] */0, /* () */0);
          }
      case /* Num */2 :
          if (inputs) {
            return Pervasives.failwith("op Num expected input arity 0, but got " + String(List.length(inputs)));
          } else {
            return Theia$Sidewinder.noop(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, vizInt(flow, aexp_op[0]), /* [] */0, /* () */0);
          }
      case /* Bracket */3 :
          if (inputs) {
            return Pervasives.failwith("op Bracket expected input arity 0, but got " + String(List.length(inputs)));
          } else {
            return TheiaExtensions$ReasonReactExamples.hSeq(uid, Belt_MapString.get(flow, uid), 2, /* :: */[
                        Theia$Sidewinder.str(undefined, undefined, undefined, "{", /* () */0),
                        /* :: */[
                          vizZExp(vizOp, flow, aexp_op[0]),
                          /* :: */[
                            Theia$Sidewinder.str(undefined, undefined, undefined, "}", /* () */0),
                            /* [] */0
                          ]
                        ]
                      ]);
          }
      
    }
  }
}

function vizAExp(flow, aexp) {
  return vizZExp(vizOp, flow, aexp);
}

function vizFocus(flow, param) {
  var focus = param[1];
  var uid = param[0];
  switch (focus.tag | 0) {
    case /* ZExp */0 :
        return Theia$Sidewinder.noop(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, vizZExp(vizOp, flow, focus[0]), /* [] */0, /* () */0);
    case /* ZPreVal */1 :
        return Theia$Sidewinder.noop(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, vizZPreVal(vizOp, flow, focus[0]), /* [] */0, /* () */0);
    case /* Value */2 :
        return Theia$Sidewinder.noop(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, vizValue(flow, focus[0]), /* [] */0, /* () */0);
    
  }
}

function vizExp(flow, exp) {
  return vizZExp(vizOp, flow, exp);
}

function vizZipper(flow, param) {
  var match = param[1];
  var uid = param[0];
  return Theia$Sidewinder.noop(uid, Flow$ReasonReactExamples.get(flow, uid), undefined, vizCtxts(flow, match.ctxts)(vizFocus(flow, match.focus)), /* [] */0, /* () */0);
}

function vizConfig(param) {
  var match = param[1];
  var match$1 = match[1];
  var uid = match[0];
  var match$2 = param[0];
  var flow = match$2[1];
  return TheiaExtensions$ReasonReactExamples.vSeq(undefined, undefined, 30, /* :: */[
              Theia$Sidewinder.str(undefined, undefined, undefined, "rule: " + match$2[0], /* () */0),
              /* :: */[
                TheiaExtensions$ReasonReactExamples.hSeq(uid, Flow$ReasonReactExamples.get(flow, uid), 20, /* :: */[
                      TheiaExtensions$ReasonReactExamples.vSeq(undefined, undefined, 5, /* :: */[
                            vizEnv(flow, match$1.env),
                            /* :: */[
                              vizZipper(flow, match$1.zipper),
                              /* [] */0
                            ]
                          ]),
                      /* :: */[
                        vizStack(flow, match$1.stack),
                        /* [] */0
                      ]
                    ]),
                /* [] */0
              ]
            ]);
}

exports.vizVid = vizVid;
exports.vizInt = vizInt;
exports.vizZExp = vizZExp;
exports.vizZCtxt = vizZCtxt;
exports.vizZPreVal = vizZPreVal;
exports.vizLambda = vizLambda;
exports.vizAExpOp = vizAExpOp;
exports.vizAExp = vizAExp;
exports.vizAExps = vizAExps;
exports.vizExpOp = vizExpOp;
exports.vizExp = vizExp;
exports.vizOp = vizOp;
exports.vizValue = vizValue;
exports.vizValues = vizValues;
exports.vizBinding = vizBinding;
exports.vizEnv = vizEnv;
exports.vizFocus = vizFocus;
exports.vizCtxts = vizCtxts;
exports.vizZipper = vizZipper;
exports.vizFrame = vizFrame;
exports.vizStack = vizStack;
exports.vizConfig = vizConfig;
/* Theia-Sidewinder Not a pure module */
