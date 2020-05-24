'use strict';

var List = require("bs-platform/lib/js/list.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var Theia$Sidewinder = require("sidewinder/src/Theia.bs.js");
var TheiaExtensions$ReasonReactExamples = require("./TheiaExtensions.bs.js");

function vizVid(param) {
  var uid = param[0];
  return Theia$Sidewinder.str(uid, {
              flowNodeType: /* Leaf */1,
              uid: uid,
              rootPath: /* [] */0
            }, undefined, param[1], /* () */0);
}

function vizInt(param) {
  var uid = param[0];
  return Theia$Sidewinder.str(uid, {
              flowNodeType: /* Leaf */1,
              uid: uid,
              rootPath: /* [] */0
            }, undefined, String(param[1]), /* () */0);
}

function vizZExp(vizOp, param) {
  var match = param[1];
  var uid = param[0];
  return Theia$Sidewinder.noop(uid, {
              flowNodeType: /* Leaf */1,
              uid: uid,
              rootPath: /* [] */0
            }, undefined, Curry._2(vizOp, match.op, vizAExps(match.args)), /* [] */0, /* () */0);
}

function vizValue(param) {
  var value = param[1];
  var uid = param[0];
  if (value.tag) {
    return TheiaExtensions$ReasonReactExamples.value(uid, {
                flowNodeType: /* Leaf */1,
                uid: uid,
                rootPath: /* [] */0
              }, "closure", TheiaExtensions$ReasonReactExamples.hSeq(undefined, undefined, undefined, List.map((function (n) {
                          return Theia$Sidewinder.box(undefined, undefined, undefined, undefined, undefined, n, /* [] */0, /* () */0);
                        }), /* :: */[
                        vizLambda(value[0]),
                        /* :: */[
                          vizEnv(value[1]),
                          /* [] */0
                        ]
                      ])));
  } else {
    return TheiaExtensions$ReasonReactExamples.value(uid, {
                flowNodeType: /* Leaf */1,
                uid: uid,
                rootPath: /* [] */0
              }, "num", vizInt(value[0]));
  }
}

function vizOp(param, inputs) {
  var op = param[1];
  var uid = param[0];
  if (op.tag) {
    return Theia$Sidewinder.noop(uid, {
                flowNodeType: /* Leaf */1,
                uid: uid,
                rootPath: /* [] */0
              }, undefined, vizAExpOp(op[0], inputs), /* [] */0, /* () */0);
  } else {
    return Theia$Sidewinder.noop(uid, {
                flowNodeType: /* Leaf */1,
                uid: uid,
                rootPath: /* [] */0
              }, undefined, vizExpOp(op[0], inputs), /* [] */0, /* () */0);
  }
}

function vizZPreVal(vizOp, param) {
  var match = param[1];
  var uid = param[0];
  return Theia$Sidewinder.noop(uid, {
              flowNodeType: /* Leaf */1,
              uid: uid,
              rootPath: /* [] */0
            }, undefined, Curry._2(vizOp, match.op, vizValues(match.values)), /* [] */0, /* () */0);
}

function vizValues(values) {
  var _acc = /* [] */0;
  var _param = values;
  while(true) {
    var param = _param;
    var acc = _acc;
    var values$1 = param[1];
    if (values$1) {
      _param = values$1[1];
      _acc = /* :: */[
        vizValue(values$1[0]),
        acc
      ];
      continue ;
    } else {
      return acc;
    }
  };
}

function vizAExps(param) {
  var aexps = param[1];
  if (aexps) {
    return /* :: */[
            vizZExp(vizOp, aexps[0]),
            vizAExps(aexps[1])
          ];
  } else {
    return /* [] */0;
  }
}

function vizZCtxt(vizOp, param, hole) {
  var match = param[1];
  var uid = param[0];
  return Theia$Sidewinder.noop(uid, {
              flowNodeType: /* Leaf */1,
              uid: uid,
              rootPath: /* [] */0
            }, undefined, Curry._2(vizOp, match.op, Pervasives.$at(vizValues(match.values), /* :: */[
                      hole,
                      vizAExps(match.args)
                    ])), /* [] */0, /* () */0);
}

function vizCtxts(_param, _hole) {
  while(true) {
    var param = _param;
    var hole = _hole;
    var ctxts = param[1];
    if (ctxts) {
      var highlightHole = TheiaExtensions$ReasonReactExamples.highlight(undefined, undefined, undefined, "hsla(240, 100%, 80%, 33%)", hole, /* [] */0, /* () */0);
      _hole = vizZCtxt(vizOp, ctxts[0], highlightHole);
      _param = ctxts[1];
      continue ;
    } else {
      return Theia$Sidewinder.noop(undefined, {
                  flowNodeType: /* Leaf */1,
                  uid: param[0],
                  rootPath: /* [] */0
                }, undefined, hole, /* [] */0, /* () */0);
    }
  };
}

function vizStack(param) {
  var stack = param[1];
  var uid = param[0];
  if (stack) {
    return TheiaExtensions$ReasonReactExamples.vSeq(uid, {
                flowNodeType: /* Leaf */1,
                uid: uid,
                rootPath: /* [] */0
              }, undefined, /* :: */[
                vizStack(stack[1]),
                /* :: */[
                  vizFrame(stack[0]),
                  /* [] */0
                ]
              ]);
  } else {
    return Theia$Sidewinder.str(uid, {
                flowNodeType: /* Leaf */1,
                uid: uid,
                rootPath: /* [] */0
              }, undefined, "stack", /* () */0);
  }
}

function vizFrame(param) {
  var match = param[1];
  var uid = param[0];
  return TheiaExtensions$ReasonReactExamples.vSeq(uid, {
              flowNodeType: /* Leaf */1,
              uid: uid,
              rootPath: /* [] */0
            }, undefined, /* :: */[
              vizEnv(match.env),
              /* :: */[
                vizCtxts(match.ctxts, TheiaExtensions$ReasonReactExamples.hole),
                /* [] */0
              ]
            ]);
}

function vizEnv(param) {
  var env = param[1];
  var uid = param[0];
  if (env) {
    return TheiaExtensions$ReasonReactExamples.vSeq(uid, {
                flowNodeType: /* Leaf */1,
                uid: uid,
                rootPath: /* [] */0
              }, undefined, /* :: */[
                vizEnv(env[1]),
                /* :: */[
                  vizBinding(env[0]),
                  /* [] */0
                ]
              ]);
  } else {
    return Theia$Sidewinder.str(uid, {
                flowNodeType: /* Leaf */1,
                uid: uid,
                rootPath: /* [] */0
              }, undefined, "env", /* () */0);
  }
}

function vizLambda(param) {
  var match = param[1];
  var uid = param[0];
  return TheiaExtensions$ReasonReactExamples.hSeq(uid, {
              flowNodeType: /* Leaf */1,
              uid: uid,
              rootPath: /* [] */0
            }, undefined, /* :: */[
              Theia$Sidewinder.str(undefined, undefined, undefined, "\\", /* () */0),
              /* :: */[
                vizVid(match.vid),
                /* :: */[
                  Theia$Sidewinder.str(undefined, undefined, undefined, ".", /* () */0),
                  /* :: */[
                    vizZExp(vizOp, match.exp),
                    /* [] */0
                  ]
                ]
              ]
            ]);
}

function vizBinding(param) {
  var match = param[1];
  var uid = param[0];
  return TheiaExtensions$ReasonReactExamples.hSeq(uid, {
              flowNodeType: /* Leaf */1,
              uid: uid,
              rootPath: /* [] */0
            }, undefined, /* :: */[
              vizVid(match.vid),
              /* :: */[
                vizValue(match.value),
                /* [] */0
              ]
            ]);
}

function vizExpOp(param, inputs) {
  var exp_op = param[1];
  var uid = param[0];
  if (exp_op.tag) {
    if (inputs) {
      if (inputs[1]) {
        return Pervasives.failwith("op Let expected input arity 1, but got " + String(List.length(inputs)));
      } else {
        return TheiaExtensions$ReasonReactExamples.vSeq(uid, {
                    flowNodeType: /* Dummy */0,
                    uid: uid,
                    rootPath: /* [] */0
                  }, undefined, /* :: */[
                    TheiaExtensions$ReasonReactExamples.hSeq(undefined, undefined, 2, /* :: */[
                          Theia$Sidewinder.str(undefined, {
                                flowNodeType: /* Leaf */1,
                                uid: uid,
                                rootPath: /* :: */[
                                  0,
                                  /* :: */[
                                    0,
                                    /* [] */0
                                  ]
                                ]
                              }, undefined, "let", /* () */0),
                          /* :: */[
                            vizVid(exp_op[0]),
                            /* :: */[
                              Theia$Sidewinder.str(undefined, {
                                    flowNodeType: /* Leaf */1,
                                    uid: uid,
                                    rootPath: /* :: */[
                                      0,
                                      /* :: */[
                                        2,
                                        /* [] */0
                                      ]
                                    ]
                                  }, undefined, "=", /* () */0),
                              /* :: */[
                                inputs[0],
                                /* :: */[
                                  Theia$Sidewinder.str(undefined, {
                                        flowNodeType: /* Leaf */1,
                                        uid: uid,
                                        rootPath: /* :: */[
                                          0,
                                          /* :: */[
                                            4,
                                            /* [] */0
                                          ]
                                        ]
                                      }, undefined, "in", /* () */0),
                                  /* [] */0
                                ]
                              ]
                            ]
                          ]
                        ]),
                    /* :: */[
                      vizZExp(vizOp, exp_op[1]),
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
    return Theia$Sidewinder.noop(uid, {
                flowNodeType: /* Leaf */1,
                uid: uid,
                rootPath: /* [] */0
              }, undefined, vizZExp(vizOp, exp_op[0]), /* [] */0, /* () */0);
  }
}

function vizAExpOp(param, inputs) {
  var aexp_op = param[1];
  var uid = param[0];
  if (typeof aexp_op === "number") {
    if (aexp_op === /* App */0) {
      if (inputs) {
        var match = inputs[1];
        if (match && !match[1]) {
          return TheiaExtensions$ReasonReactExamples.hSeq(uid, {
                      flowNodeType: /* Dummy */0,
                      uid: uid,
                      rootPath: /* [] */0
                    }, 2, /* :: */[
                      Theia$Sidewinder.str(undefined, {
                            flowNodeType: /* Leaf */1,
                            uid: uid,
                            rootPath: /* :: */[
                              0,
                              /* [] */0
                            ]
                          }, undefined, "(", /* () */0),
                      /* :: */[
                        inputs[0],
                        /* :: */[
                          Theia$Sidewinder.str(undefined, {
                                flowNodeType: /* Leaf */1,
                                uid: uid,
                                rootPath: /* :: */[
                                  2,
                                  /* [] */0
                                ]
                              }, undefined, ")", /* () */0),
                          /* :: */[
                            Theia$Sidewinder.str(undefined, {
                                  flowNodeType: /* Leaf */1,
                                  uid: uid,
                                  rootPath: /* :: */[
                                    3,
                                    /* [] */0
                                  ]
                                }, undefined, "(", /* () */0),
                            /* :: */[
                              match[0],
                              /* :: */[
                                Theia$Sidewinder.str(undefined, {
                                      flowNodeType: /* Leaf */1,
                                      uid: uid,
                                      rootPath: /* :: */[
                                        5,
                                        /* [] */0
                                      ]
                                    }, undefined, ")", /* () */0),
                                /* [] */0
                              ]
                            ]
                          ]
                        ]
                      ]
                    ]);
        }
        
      }
      return Pervasives.failwith("op App expected input arity 2, but got " + String(List.length(inputs)));
    } else {
      if (inputs) {
        var match$1 = inputs[1];
        if (match$1 && !match$1[1]) {
          return TheiaExtensions$ReasonReactExamples.hSeq(undefined, {
                      flowNodeType: /* Dummy */0,
                      uid: uid,
                      rootPath: /* [] */0
                    }, 2, /* :: */[
                      Theia$Sidewinder.str(undefined, {
                            flowNodeType: /* Leaf */1,
                            uid: uid,
                            rootPath: /* :: */[
                              0,
                              /* [] */0
                            ]
                          }, undefined, "(", /* () */0),
                      /* :: */[
                        inputs[0],
                        /* :: */[
                          Theia$Sidewinder.str(undefined, {
                                flowNodeType: /* Leaf */1,
                                uid: uid,
                                rootPath: /* :: */[
                                  2,
                                  /* [] */0
                                ]
                              }, undefined, ")", /* () */0),
                          /* :: */[
                            Theia$Sidewinder.str(undefined, {
                                  flowNodeType: /* Leaf */1,
                                  uid: uid,
                                  rootPath: /* :: */[
                                    3,
                                    /* [] */0
                                  ]
                                }, undefined, "+", /* () */0),
                            /* :: */[
                              Theia$Sidewinder.str(undefined, {
                                    flowNodeType: /* Leaf */1,
                                    uid: uid,
                                    rootPath: /* :: */[
                                      4,
                                      /* [] */0
                                    ]
                                  }, undefined, "(", /* () */0),
                              /* :: */[
                                match$1[0],
                                /* :: */[
                                  Theia$Sidewinder.str(undefined, {
                                        flowNodeType: /* Leaf */1,
                                        uid: uid,
                                        rootPath: /* :: */[
                                          6,
                                          /* [] */0
                                        ]
                                      }, undefined, ")", /* () */0),
                                  /* [] */0
                                ]
                              ]
                            ]
                          ]
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
            return Theia$Sidewinder.noop(uid, {
                        flowNodeType: /* Leaf */1,
                        uid: uid,
                        rootPath: /* [] */0
                      }, undefined, vizVid(aexp_op[0]), /* [] */0, /* () */0);
          }
      case /* Lam */1 :
          if (inputs) {
            return Pervasives.failwith("op Lam expected input arity 0, but got " + String(List.length(inputs)));
          } else {
            return Theia$Sidewinder.noop(uid, {
                        flowNodeType: /* Leaf */1,
                        uid: uid,
                        rootPath: /* [] */0
                      }, undefined, vizLambda(aexp_op[0]), /* [] */0, /* () */0);
          }
      case /* Num */2 :
          if (inputs) {
            return Pervasives.failwith("op Num expected input arity 0, but got " + String(List.length(inputs)));
          } else {
            return Theia$Sidewinder.noop(uid, {
                        flowNodeType: /* Leaf */1,
                        uid: uid,
                        rootPath: /* [] */0
                      }, undefined, vizInt(aexp_op[0]), /* [] */0, /* () */0);
          }
      case /* Bracket */3 :
          if (inputs) {
            return Pervasives.failwith("op Bracket expected input arity 0, but got " + String(List.length(inputs)));
          } else {
            return TheiaExtensions$ReasonReactExamples.hSeq(uid, {
                        flowNodeType: /* Leaf */1,
                        uid: uid,
                        rootPath: /* [] */0
                      }, 2, /* :: */[
                        Theia$Sidewinder.str(undefined, undefined, undefined, "{", /* () */0),
                        /* :: */[
                          vizZExp(vizOp, aexp_op[0]),
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

function vizExp(exp) {
  return vizZExp(vizOp, exp);
}

function vizFocus(param) {
  var focus = param[1];
  var uid = param[0];
  switch (focus.tag | 0) {
    case /* ZExp */0 :
        return Theia$Sidewinder.noop(uid, {
                    flowNodeType: /* Leaf */1,
                    uid: uid,
                    rootPath: /* [] */0
                  }, undefined, vizZExp(vizOp, focus[0]), /* [] */0, /* () */0);
    case /* ZPreVal */1 :
        return Theia$Sidewinder.noop(uid, {
                    flowNodeType: /* Leaf */1,
                    uid: uid,
                    rootPath: /* [] */0
                  }, undefined, vizZPreVal(vizOp, focus[0]), /* [] */0, /* () */0);
    case /* Value */2 :
        return Theia$Sidewinder.noop(uid, {
                    flowNodeType: /* Leaf */1,
                    uid: uid,
                    rootPath: /* [] */0
                  }, undefined, vizValue(focus[0]), /* [] */0, /* () */0);
    
  }
}

function vizAExp(aexp) {
  return vizZExp(vizOp, aexp);
}

function vizZipper(param) {
  var match = param[1];
  var uid = param[0];
  return Theia$Sidewinder.noop(uid, {
              flowNodeType: /* Leaf */1,
              uid: uid,
              rootPath: /* [] */0
            }, undefined, vizCtxts(match.ctxts, vizFocus(match.focus)), /* [] */0, /* () */0);
}

function vizConfig(param) {
  var match = param[1];
  var match$1 = match[1];
  var uid = match[0];
  return TheiaExtensions$ReasonReactExamples.vSeq(undefined, undefined, 30, /* :: */[
              Theia$Sidewinder.str(undefined, undefined, undefined, "rule: " + param[0][0], /* () */0),
              /* :: */[
                TheiaExtensions$ReasonReactExamples.hSeq(uid, {
                      flowNodeType: /* Leaf */1,
                      uid: uid,
                      rootPath: /* [] */0
                    }, 20, /* :: */[
                      TheiaExtensions$ReasonReactExamples.vSeq(undefined, undefined, 5, /* :: */[
                            vizEnv(match$1.env),
                            /* :: */[
                              vizZipper(match$1.zipper),
                              /* [] */0
                            ]
                          ]),
                      /* :: */[
                        vizStack(match$1.stack),
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
