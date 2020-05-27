'use strict';

var List = require("bs-platform/lib/js/list.js");
var $$Array = require("bs-platform/lib/js/array.js");
var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var Flow$Sidewinder = require("sidewinder/src/Flow.bs.js");
var UID$ReasonReactExamples = require("./UID.bs.js");

function mkVid(v) {
  return UID$ReasonReactExamples.makeUIDConstructor("vid", v);
}

function mkInt(n) {
  return UID$ReasonReactExamples.makeUIDConstructor("int", n);
}

function mkZExp(ze) {
  return UID$ReasonReactExamples.makeUIDConstructor("zexp", ze);
}

function mkZCtxt(zc) {
  return UID$ReasonReactExamples.makeUIDConstructor("zctxt", zc);
}

function mkZPreVal(zp) {
  return UID$ReasonReactExamples.makeUIDConstructor("zpreval", zp);
}

function mkLambda(l) {
  return UID$ReasonReactExamples.makeUIDConstructor("lambda", l);
}

function mkAExpOp(aeo) {
  return UID$ReasonReactExamples.makeUIDConstructor("aexp_op", aeo);
}

function mkAExp(ae) {
  return UID$ReasonReactExamples.makeUIDConstructor("aexp", ae);
}

function mkAExps(aes) {
  return UID$ReasonReactExamples.makeUIDConstructor("aexps", aes);
}

function mkExpOp(eo) {
  return UID$ReasonReactExamples.makeUIDConstructor("exp_op", eo);
}

function mkExp(e) {
  return UID$ReasonReactExamples.makeUIDConstructor("exp", e);
}

function mkOp(o) {
  return UID$ReasonReactExamples.makeUIDConstructor("op", o);
}

function mkValue(v) {
  return UID$ReasonReactExamples.makeUIDConstructor("value", v);
}

function mkValues(vs) {
  return UID$ReasonReactExamples.makeUIDConstructor("values", vs);
}

function mkBinding(b) {
  return UID$ReasonReactExamples.makeUIDConstructor("binding", b);
}

function mkEnv(e) {
  return UID$ReasonReactExamples.makeUIDConstructor("env", e);
}

function mkFocus(f) {
  return UID$ReasonReactExamples.makeUIDConstructor("focus", f);
}

function mkCtxts(cs) {
  return UID$ReasonReactExamples.makeUIDConstructor("ctxts", cs);
}

function mkZipper(z) {
  return UID$ReasonReactExamples.makeUIDConstructor("zipper", z);
}

function mkFrame(f) {
  return UID$ReasonReactExamples.makeUIDConstructor("frame", f);
}

function mkStack(s) {
  return UID$ReasonReactExamples.makeUIDConstructor("stack", s);
}

function mkConfig(c) {
  return UID$ReasonReactExamples.makeUIDConstructor("config", c);
}

function vidToUID(v) {
  return UID$ReasonReactExamples.makeUIDConstructor("vid", v);
}

function intToUID(n) {
  return UID$ReasonReactExamples.makeUIDConstructor("int", n);
}

function zexpToUID(opToUID, param) {
  return UID$ReasonReactExamples.makeUIDConstructor("zexp", {
              op: Curry._1(opToUID, param.op),
              args: aexpsToUID(param.args)
            });
}

function opToUID(o) {
  var tmp;
  tmp = o.tag ? /* AExp */Block.__(1, [aexp_opToUID(o[0])]) : /* Exp */Block.__(0, [exp_opToUID(o[0])]);
  return UID$ReasonReactExamples.makeUIDConstructor("op", tmp);
}

function aexpsToUID(aes) {
  return UID$ReasonReactExamples.makeUIDConstructor("aexps", aes ? /* Cons */[
                zexpToUID(opToUID, aes[0]),
                aexpsToUID(aes[1])
              ] : /* Empty */0);
}

function zprevalToUID(opToUID, param) {
  return UID$ReasonReactExamples.makeUIDConstructor("zpreval", {
              op: Curry._1(opToUID, param.op),
              values: valuesToUID(param.values)
            });
}

function valueToUID(v) {
  var tmp;
  tmp = v.tag ? /* Clo */Block.__(1, [
        lambdaToUID(v[0]),
        envToUID(v[1])
      ]) : /* VNum */Block.__(0, [UID$ReasonReactExamples.makeUIDConstructor("int", v[0])]);
  return UID$ReasonReactExamples.makeUIDConstructor("value", tmp);
}

function bindingToUID(param) {
  return UID$ReasonReactExamples.makeUIDConstructor("binding", {
              vid: UID$ReasonReactExamples.makeUIDConstructor("vid", param.vid),
              value: valueToUID(param.value)
            });
}

function envToUID(e) {
  return UID$ReasonReactExamples.makeUIDConstructor("env", e ? /* Cons */[
                bindingToUID(e[0]),
                envToUID(e[1])
              ] : /* Empty */0);
}

function stackToUID(s) {
  return UID$ReasonReactExamples.makeUIDConstructor("stack", s ? /* Cons */[
                frameToUID(s[0]),
                stackToUID(s[1])
              ] : /* Empty */0);
}

function frameToUID(param) {
  return UID$ReasonReactExamples.makeUIDConstructor("frame", {
              ctxts: ctxtsToUID(param.ctxts),
              env: envToUID(param.env)
            });
}

function valuesToUID(vs) {
  return UID$ReasonReactExamples.makeUIDConstructor("values", vs ? /* Cons */[
                valueToUID(vs[0]),
                valuesToUID(vs[1])
              ] : /* Empty */0);
}

function zctxtToUID(opToUID, param) {
  return UID$ReasonReactExamples.makeUIDConstructor("zctxt", {
              op: Curry._1(opToUID, param.op),
              args: aexpsToUID(param.args),
              values: valuesToUID(param.values)
            });
}

function ctxtsToUID(cs) {
  return UID$ReasonReactExamples.makeUIDConstructor("ctxts", cs ? /* Cons */[
                zctxtToUID(opToUID, cs[0]),
                ctxtsToUID(cs[1])
              ] : /* Empty */0);
}

function lambdaToUID(param) {
  return UID$ReasonReactExamples.makeUIDConstructor("lambda", {
              vid: UID$ReasonReactExamples.makeUIDConstructor("vid", param.vid),
              exp: zexpToUID(opToUID, param.exp)
            });
}

function aexp_opToUID(aeo) {
  var tmp;
  if (typeof aeo === "number") {
    tmp = aeo === /* App */0 ? /* App */0 : /* Add */1;
  } else {
    switch (aeo.tag | 0) {
      case /* Var */0 :
          tmp = /* Var */Block.__(0, [UID$ReasonReactExamples.makeUIDConstructor("vid", aeo[0])]);
          break;
      case /* Lam */1 :
          tmp = /* Lam */Block.__(1, [lambdaToUID(aeo[0])]);
          break;
      case /* Num */2 :
          tmp = /* Num */Block.__(2, [UID$ReasonReactExamples.makeUIDConstructor("int", aeo[0])]);
          break;
      case /* Bracket */3 :
          tmp = /* Bracket */Block.__(3, [zexpToUID(opToUID, aeo[0])]);
          break;
      
    }
  }
  return UID$ReasonReactExamples.makeUIDConstructor("aexp_op", tmp);
}

function exp_opToUID(eo) {
  var tmp;
  tmp = eo.tag ? /* Let */Block.__(1, [
        UID$ReasonReactExamples.makeUIDConstructor("vid", eo[0]),
        zexpToUID(opToUID, eo[1])
      ]) : /* Lift */Block.__(0, [zexpToUID(opToUID, eo[0])]);
  return UID$ReasonReactExamples.makeUIDConstructor("exp_op", tmp);
}

function focusToUID(f) {
  var tmp;
  switch (f.tag | 0) {
    case /* ZExp */0 :
        tmp = /* ZExp */Block.__(0, [zexpToUID(opToUID, f[0])]);
        break;
    case /* ZPreVal */1 :
        tmp = /* ZPreVal */Block.__(1, [zprevalToUID(opToUID, f[0])]);
        break;
    case /* Value */2 :
        tmp = /* Value */Block.__(2, [valueToUID(f[0])]);
        break;
    
  }
  return UID$ReasonReactExamples.makeUIDConstructor("focus", tmp);
}

function aexpToUID(ae) {
  return zexpToUID(opToUID, ae);
}

function expToUID(e) {
  return zexpToUID(opToUID, e);
}

function zipperToUID(param) {
  return UID$ReasonReactExamples.makeUIDConstructor("zipper", {
              focus: focusToUID(param.focus),
              ctxts: ctxtsToUID(param.ctxts)
            });
}

function configToUID(param) {
  return UID$ReasonReactExamples.makeUIDConstructor("config", {
              zipper: zipperToUID(param.zipper),
              env: envToUID(param.env),
              stack: stackToUID(param.stack)
            });
}

function vidFromUID(param) {
  return param[1];
}

function intFromUID(param) {
  return param[1];
}

function zexpFromUID(opFromUID, param) {
  var match = param[1];
  return {
          op: Curry._1(opFromUID, match.op),
          args: aexpsFromUID(match.args)
        };
}

function opFromUID(param) {
  var op = param[1];
  if (op.tag) {
    return /* AExp */Block.__(1, [aexp_opFromUID(op[0])]);
  } else {
    return /* Exp */Block.__(0, [exp_opFromUID(op[0])]);
  }
}

function valueFromUID(param) {
  var value = param[1];
  if (value.tag) {
    return /* Clo */Block.__(1, [
              lambdaFromUID(value[0]),
              envFromUID(value[1])
            ]);
  } else {
    return /* VNum */Block.__(0, [intFromUID(value[0])]);
  }
}

function ctxtsFromUID(param) {
  var ctxts = param[1];
  if (ctxts) {
    return /* :: */[
            zctxtFromUID(opFromUID, ctxts[0]),
            ctxtsFromUID(ctxts[1])
          ];
  } else {
    return /* [] */0;
  }
}

function zctxtFromUID(opFromUID, param) {
  var match = param[1];
  return {
          op: Curry._1(opFromUID, match.op),
          args: aexpsFromUID(match.args),
          values: valuesFromUID(match.values)
        };
}

function lambdaFromUID(param) {
  var match = param[1];
  return {
          vid: vidFromUID(match.vid),
          exp: zexpFromUID(opFromUID, match.exp)
        };
}

function envFromUID(param) {
  var env = param[1];
  if (env) {
    return /* :: */[
            bindingFromUID(env[0]),
            envFromUID(env[1])
          ];
  } else {
    return /* [] */0;
  }
}

function bindingFromUID(param) {
  var match = param[1];
  return {
          vid: vidFromUID(match.vid),
          value: valueFromUID(match.value)
        };
}

function valuesFromUID(param) {
  var values = param[1];
  if (values) {
    return /* :: */[
            valueFromUID(values[0]),
            valuesFromUID(values[1])
          ];
  } else {
    return /* [] */0;
  }
}

function aexpsFromUID(param) {
  var aexps = param[1];
  if (aexps) {
    return /* :: */[
            zexpFromUID(opFromUID, aexps[0]),
            aexpsFromUID(aexps[1])
          ];
  } else {
    return /* [] */0;
  }
}

function aexp_opFromUID(param) {
  var aeo = param[1];
  if (typeof aeo === "number") {
    if (aeo === /* App */0) {
      return /* App */0;
    } else {
      return /* Add */1;
    }
  }
  switch (aeo.tag | 0) {
    case /* Var */0 :
        return /* Var */Block.__(0, [vidFromUID(aeo[0])]);
    case /* Lam */1 :
        return /* Lam */Block.__(1, [lambdaFromUID(aeo[0])]);
    case /* Num */2 :
        return /* Num */Block.__(2, [intFromUID(aeo[0])]);
    case /* Bracket */3 :
        return /* Bracket */Block.__(3, [zexpFromUID(opFromUID, aeo[0])]);
    
  }
}

function exp_opFromUID(param) {
  var exp_op = param[1];
  if (exp_op.tag) {
    return /* Let */Block.__(1, [
              vidFromUID(exp_op[0]),
              zexpFromUID(opFromUID, exp_op[1])
            ]);
  } else {
    return /* Lift */Block.__(0, [zexpFromUID(opFromUID, exp_op[0])]);
  }
}

function zprevalFromUID(opFromUID, param) {
  var match = param[1];
  return {
          op: Curry._1(opFromUID, match.op),
          values: valuesFromUID(match.values)
        };
}

function stackFromUID(param) {
  var stack = param[1];
  if (stack) {
    return /* :: */[
            frameFromUID(stack[0]),
            stackFromUID(stack[1])
          ];
  } else {
    return /* [] */0;
  }
}

function frameFromUID(param) {
  var match = param[1];
  return {
          ctxts: ctxtsFromUID(match.ctxts),
          env: envFromUID(match.env)
        };
}

function focusFromUID(param) {
  var focus = param[1];
  switch (focus.tag | 0) {
    case /* ZExp */0 :
        return /* ZExp */Block.__(0, [zexpFromUID(opFromUID, focus[0])]);
    case /* ZPreVal */1 :
        return /* ZPreVal */Block.__(1, [zprevalFromUID(opFromUID, focus[0])]);
    case /* Value */2 :
        return /* Value */Block.__(2, [valueFromUID(focus[0])]);
    
  }
}

function expFromUID(exp) {
  return zexpFromUID(opFromUID, exp);
}

function aexpFromUID(aexp) {
  return zexpFromUID(opFromUID, aexp);
}

function zipperFromUID(param) {
  var match = param[1];
  return {
          focus: focusFromUID(match.focus),
          ctxts: ctxtsFromUID(match.ctxts)
        };
}

function configFromUID(param) {
  var match = param[1];
  return {
          zipper: zipperFromUID(match.zipper),
          env: envFromUID(match.env),
          stack: stackFromUID(match.stack)
        };
}

function lookup(x, _env) {
  while(true) {
    var env = _env;
    var env_val = env[1];
    if (!env_val) {
      return ;
    }
    var match = env_val[0][1];
    var match$1 = match.value;
    var v_val = match$1[1];
    var v_uid = match$1[0];
    if (x[1] === match.vid[1]) {
      var fresh = "valLookup_" + UID$ReasonReactExamples.rauc(undefined);
      if (v_val.tag) {
        return /* tuple */[
                /* tuple */[
                  fresh,
                  v_val
                ],
                Flow$Sidewinder.fromArray([/* tuple */[
                        v_uid,
                        /* :: */[
                          v_uid,
                          /* :: */[
                            fresh,
                            /* [] */0
                          ]
                        ]
                      ]])
              ];
      } else {
        return /* tuple */[
                /* tuple */[
                  fresh,
                  /* VNum */Block.__(0, [/* tuple */[
                        "valLookup_int_" + UID$ReasonReactExamples.rauc(undefined),
                        v_val[0][1]
                      ]])
                ],
                Flow$Sidewinder.fromArray([/* tuple */[
                        v_uid,
                        /* :: */[
                          v_uid,
                          /* :: */[
                            fresh,
                            /* [] */0
                          ]
                        ]
                      ]])
              ];
      }
    }
    _env = /* tuple */[
      env[0],
      env_val[1][1]
    ];
    continue ;
  };
}

function step(param) {
  var c = param[1];
  var match = c.zipper[1];
  var v = match.focus[1];
  switch (v.tag | 0) {
    case /* ZExp */0 :
        var match$1 = v[0][1];
        var op = match$1.op;
        var match$2 = op[1];
        var op_uid = op[0];
        if (match$2.tag) {
          var x = match$2[0][1];
          if (typeof x !== "number") {
            switch (x.tag | 0) {
              case /* Var */0 :
                  if (!match$1.args[1]) {
                    var stack = c.stack;
                    var stack_uid = stack[0];
                    var env = c.env;
                    var env_uid = env[0];
                    var ctxts = match.ctxts;
                    var ctxts_uid = ctxts[0];
                    var x$1 = x[0];
                    var match$3 = lookup(x$1, env);
                    if (match$3 !== undefined) {
                      return /* tuple */[
                              UID$ReasonReactExamples.makeUIDConstructor("config", {
                                    zipper: UID$ReasonReactExamples.makeUIDConstructor("zipper", {
                                          focus: UID$ReasonReactExamples.makeUIDConstructor("focus", /* Value */Block.__(2, [match$3[0]])),
                                          ctxts: ctxts
                                        }),
                                    env: env,
                                    stack: stack
                                  }),
                              /* tuple */[
                                "var",
                                Flow$Sidewinder.union(Flow$Sidewinder.fromArray([
                                          /* tuple */[
                                            x$1[0],
                                            /* [] */0
                                          ],
                                          /* tuple */[
                                            ctxts_uid,
                                            /* :: */[
                                              ctxts_uid,
                                              /* [] */0
                                            ]
                                          ],
                                          /* tuple */[
                                            env_uid,
                                            /* :: */[
                                              env_uid,
                                              /* [] */0
                                            ]
                                          ],
                                          /* tuple */[
                                            stack_uid,
                                            /* :: */[
                                              stack_uid,
                                              /* [] */0
                                            ]
                                          ]
                                        ]), match$3[1])
                              ]
                            ];
                    } else {
                      return ;
                    }
                  }
                  break;
              case /* Lam */1 :
                  if (!match$1.args[1]) {
                    var stack$1 = c.stack;
                    var stack_uid$1 = stack$1[0];
                    var env$1 = c.env;
                    var env_uid$1 = env$1[0];
                    var ctxts$1 = match.ctxts;
                    var ctxts_uid$1 = ctxts$1[0];
                    var l = x[0];
                    var l_uid = l[0];
                    var env2 = envToUID(envFromUID(env$1));
                    return /* tuple */[
                            UID$ReasonReactExamples.makeUIDConstructor("config", {
                                  zipper: UID$ReasonReactExamples.makeUIDConstructor("zipper", {
                                        focus: UID$ReasonReactExamples.makeUIDConstructor("focus", /* Value */Block.__(2, [UID$ReasonReactExamples.makeUIDConstructor("value", /* Clo */Block.__(1, [
                                                        l,
                                                        env2
                                                      ]))])),
                                        ctxts: ctxts$1
                                      }),
                                  env: env$1,
                                  stack: stack$1
                                }),
                            /* tuple */[
                              "lam",
                              Flow$Sidewinder.fromArray([
                                    /* tuple */[
                                      l_uid,
                                      /* :: */[
                                        l_uid,
                                        /* [] */0
                                      ]
                                    ],
                                    /* tuple */[
                                      env_uid$1,
                                      /* :: */[
                                        env_uid$1,
                                        /* :: */[
                                          env2[0],
                                          /* [] */0
                                        ]
                                      ]
                                    ],
                                    /* tuple */[
                                      ctxts_uid$1,
                                      /* :: */[
                                        ctxts_uid$1,
                                        /* [] */0
                                      ]
                                    ],
                                    /* tuple */[
                                      stack_uid$1,
                                      /* :: */[
                                        stack_uid$1,
                                        /* [] */0
                                      ]
                                    ]
                                  ])
                            ]
                          ];
                  }
                  break;
              default:
                
            }
          }
          
        }
        var match$4 = match$1.args[1];
        if (match$4) {
          var stack$2 = c.stack;
          var stack_uid$2 = stack$2[0];
          var env$2 = c.env;
          var env_uid$2 = env$2[0];
          var ctxts$2 = match.ctxts;
          var ctxts_uid$2 = ctxts$2[0];
          var args = match$4[1];
          var args_uid = args[0];
          var a = match$4[0];
          var a_uid = a[0];
          return /* tuple */[
                  UID$ReasonReactExamples.makeUIDConstructor("config", {
                        zipper: UID$ReasonReactExamples.makeUIDConstructor("zipper", {
                              focus: UID$ReasonReactExamples.makeUIDConstructor("focus", /* ZExp */Block.__(0, [a])),
                              ctxts: UID$ReasonReactExamples.makeUIDConstructor("ctxts", /* Cons */[
                                    UID$ReasonReactExamples.makeUIDConstructor("zctxt", {
                                          op: op,
                                          args: args,
                                          values: UID$ReasonReactExamples.makeUIDConstructor("values", /* Empty */0)
                                        }),
                                    ctxts$2
                                  ])
                            }),
                        env: env$2,
                        stack: stack$2
                      }),
                  /* tuple */[
                    "zipper begin",
                    Flow$Sidewinder.fromArray([
                          /* tuple */[
                            op_uid,
                            /* :: */[
                              op_uid,
                              /* [] */0
                            ]
                          ],
                          /* tuple */[
                            a_uid,
                            /* :: */[
                              a_uid,
                              /* [] */0
                            ]
                          ],
                          /* tuple */[
                            args_uid,
                            /* :: */[
                              args_uid,
                              /* [] */0
                            ]
                          ],
                          /* tuple */[
                            ctxts_uid$2,
                            /* :: */[
                              ctxts_uid$2,
                              /* [] */0
                            ]
                          ],
                          /* tuple */[
                            env_uid$2,
                            /* :: */[
                              env_uid$2,
                              /* [] */0
                            ]
                          ],
                          /* tuple */[
                            stack_uid$2,
                            /* :: */[
                              stack_uid$2,
                              /* [] */0
                            ]
                          ]
                        ])
                  ]
                ];
        }
        var stack$3 = c.stack;
        var stack_uid$3 = stack$3[0];
        var env$3 = c.env;
        var env_uid$3 = env$3[0];
        var ctxts$3 = match.ctxts;
        var ctxts_uid$3 = ctxts$3[0];
        return /* tuple */[
                UID$ReasonReactExamples.makeUIDConstructor("config", {
                      zipper: UID$ReasonReactExamples.makeUIDConstructor("zipper", {
                            focus: UID$ReasonReactExamples.makeUIDConstructor("focus", /* ZPreVal */Block.__(1, [UID$ReasonReactExamples.makeUIDConstructor("zpreval", {
                                          op: op,
                                          values: UID$ReasonReactExamples.makeUIDConstructor("values", /* Empty */0)
                                        })])),
                            ctxts: ctxts$3
                          }),
                      env: env$3,
                      stack: stack$3
                    }),
                /* tuple */[
                  "zipper skip",
                  Flow$Sidewinder.fromArray([
                        /* tuple */[
                          op_uid,
                          /* :: */[
                            op_uid,
                            /* [] */0
                          ]
                        ],
                        /* tuple */[
                          ctxts_uid$3,
                          /* :: */[
                            ctxts_uid$3,
                            /* [] */0
                          ]
                        ],
                        /* tuple */[
                          env_uid$3,
                          /* :: */[
                            env_uid$3,
                            /* [] */0
                          ]
                        ],
                        /* tuple */[
                          stack_uid$3,
                          /* :: */[
                            stack_uid$3,
                            /* [] */0
                          ]
                        ]
                      ])
                ]
              ];
        break;
    case /* ZPreVal */1 :
        var match$5 = v[0][1];
        var match$6 = match$5.op[1];
        if (match$6.tag) {
          var n = match$6[0][1];
          if (typeof n === "number") {
            if (n === /* App */0) {
              var match$7 = match$5.values[1];
              if (!match$7) {
                return ;
              }
              var match$8 = match$7[1][1];
              if (!match$8) {
                return ;
              }
              var match$9 = match$8[0][1];
              var v2 = match$7[0];
              var v2_uid = v2[0];
              if (!match$9.tag) {
                return ;
              }
              if (match$8[1][1]) {
                return ;
              }
              var stack$4 = c.stack;
              var stack_uid$4 = stack$4[0];
              var env$prime = c.env;
              var env$prime_uid = env$prime[0];
              var ctxts$4 = match.ctxts;
              var ctxts_uid$4 = ctxts$4[0];
              var env$4 = match$9[1];
              var env_uid$4 = env$4[0];
              var match$10 = match$9[0][1];
              var e = match$10.exp;
              var e_uid = e[0];
              var x$2 = match$10.vid;
              var x_uid = x$2[0];
              return /* tuple */[
                      UID$ReasonReactExamples.makeUIDConstructor("config", {
                            zipper: UID$ReasonReactExamples.makeUIDConstructor("zipper", {
                                  focus: UID$ReasonReactExamples.makeUIDConstructor("focus", /* ZExp */Block.__(0, [e])),
                                  ctxts: UID$ReasonReactExamples.makeUIDConstructor("ctxts", /* Empty */0)
                                }),
                            env: UID$ReasonReactExamples.makeUIDConstructor("env", /* Cons */[
                                  UID$ReasonReactExamples.makeUIDConstructor("binding", {
                                        vid: x$2,
                                        value: v2
                                      }),
                                  env$4
                                ]),
                            stack: UID$ReasonReactExamples.makeUIDConstructor("stack", /* Cons */[
                                  UID$ReasonReactExamples.makeUIDConstructor("frame", {
                                        ctxts: ctxts$4,
                                        env: env$prime
                                      }),
                                  stack$4
                                ])
                          }),
                      /* tuple */[
                        "app enter",
                        Flow$Sidewinder.fromArray([
                              /* tuple */[
                                v2_uid,
                                /* :: */[
                                  v2_uid,
                                  /* [] */0
                                ]
                              ],
                              /* tuple */[
                                x_uid,
                                /* :: */[
                                  x_uid,
                                  /* [] */0
                                ]
                              ],
                              /* tuple */[
                                e_uid,
                                /* :: */[
                                  e_uid,
                                  /* [] */0
                                ]
                              ],
                              /* tuple */[
                                env_uid$4,
                                /* :: */[
                                  env_uid$4,
                                  /* [] */0
                                ]
                              ],
                              /* tuple */[
                                ctxts_uid$4,
                                /* :: */[
                                  ctxts_uid$4,
                                  /* [] */0
                                ]
                              ],
                              /* tuple */[
                                env$prime_uid,
                                /* :: */[
                                  env$prime_uid,
                                  /* [] */0
                                ]
                              ],
                              /* tuple */[
                                stack_uid$4,
                                /* :: */[
                                  stack_uid$4,
                                  /* [] */0
                                ]
                              ]
                            ])
                      ]
                    ];
            }
            var match$11 = match$5.values[1];
            if (!match$11) {
              return ;
            }
            var match$12 = match$11[0][1];
            if (match$12.tag) {
              return ;
            }
            var match$13 = match$11[1][1];
            if (!match$13) {
              return ;
            }
            var match$14 = match$13[0][1];
            var match$15 = match$12[0];
            if (match$14.tag) {
              return ;
            }
            if (match$13[1][1]) {
              return ;
            }
            var stack$5 = c.stack;
            var stack_uid$5 = stack$5[0];
            var env$5 = c.env;
            var env_uid$5 = env$5[0];
            var ctxts$5 = match.ctxts;
            var ctxts_uid$5 = ctxts$5[0];
            var match$16 = match$14[0];
            var v3 = UID$ReasonReactExamples.makeUIDConstructor("int", match$16[1] + match$15[1] | 0);
            var v3_uid = v3[0];
            return /* tuple */[
                    UID$ReasonReactExamples.makeUIDConstructor("config", {
                          zipper: UID$ReasonReactExamples.makeUIDConstructor("zipper", {
                                focus: UID$ReasonReactExamples.makeUIDConstructor("focus", /* Value */Block.__(2, [UID$ReasonReactExamples.makeUIDConstructor("value", /* VNum */Block.__(0, [v3]))])),
                                ctxts: ctxts$5
                              }),
                          env: env$5,
                          stack: stack$5
                        }),
                    /* tuple */[
                      "add",
                      Flow$Sidewinder.fromArray([
                            /* tuple */[
                              match$16[0],
                              /* :: */[
                                v3_uid,
                                /* [] */0
                              ]
                            ],
                            /* tuple */[
                              match$15[0],
                              /* :: */[
                                v3_uid,
                                /* [] */0
                              ]
                            ],
                            /* tuple */[
                              ctxts_uid$5,
                              /* :: */[
                                ctxts_uid$5,
                                /* [] */0
                              ]
                            ],
                            /* tuple */[
                              env_uid$5,
                              /* :: */[
                                env_uid$5,
                                /* [] */0
                              ]
                            ],
                            /* tuple */[
                              stack_uid$5,
                              /* :: */[
                                stack_uid$5,
                                /* [] */0
                              ]
                            ]
                          ])
                    ]
                  ];
          } else {
            switch (n.tag | 0) {
              case /* Var */0 :
              case /* Lam */1 :
                  return ;
              case /* Num */2 :
                  if (match$5.values[1]) {
                    return ;
                  }
                  var stack$6 = c.stack;
                  var stack_uid$6 = stack$6[0];
                  var env$6 = c.env;
                  var env_uid$6 = env$6[0];
                  var ctxts$6 = match.ctxts;
                  var ctxts_uid$6 = ctxts$6[0];
                  var n$1 = n[0];
                  var n_uid = n$1[0];
                  return /* tuple */[
                          UID$ReasonReactExamples.makeUIDConstructor("config", {
                                zipper: UID$ReasonReactExamples.makeUIDConstructor("zipper", {
                                      focus: UID$ReasonReactExamples.makeUIDConstructor("focus", /* Value */Block.__(2, [UID$ReasonReactExamples.makeUIDConstructor("value", /* VNum */Block.__(0, [n$1]))])),
                                      ctxts: ctxts$6
                                    }),
                                env: env$6,
                                stack: stack$6
                              }),
                          /* tuple */[
                            "num",
                            Flow$Sidewinder.fromArray([
                                  /* tuple */[
                                    n_uid,
                                    /* :: */[
                                      n_uid,
                                      /* [] */0
                                    ]
                                  ],
                                  /* tuple */[
                                    ctxts_uid$6,
                                    /* :: */[
                                      ctxts_uid$6,
                                      /* [] */0
                                    ]
                                  ],
                                  /* tuple */[
                                    env_uid$6,
                                    /* :: */[
                                      env_uid$6,
                                      /* [] */0
                                    ]
                                  ],
                                  /* tuple */[
                                    stack_uid$6,
                                    /* :: */[
                                      stack_uid$6,
                                      /* [] */0
                                    ]
                                  ]
                                ])
                          ]
                        ];
              case /* Bracket */3 :
                  if (match$5.values[1]) {
                    return ;
                  }
                  var stack$7 = c.stack;
                  var stack_uid$7 = stack$7[0];
                  var env$7 = c.env;
                  var env_uid$7 = env$7[0];
                  var ctxts$7 = match.ctxts;
                  var ctxts_uid$7 = ctxts$7[0];
                  var e$1 = n[0];
                  var e_uid$1 = e$1[0];
                  return /* tuple */[
                          UID$ReasonReactExamples.makeUIDConstructor("config", {
                                zipper: UID$ReasonReactExamples.makeUIDConstructor("zipper", {
                                      focus: UID$ReasonReactExamples.makeUIDConstructor("focus", /* ZExp */Block.__(0, [e$1])),
                                      ctxts: UID$ReasonReactExamples.makeUIDConstructor("ctxts", /* Empty */0)
                                    }),
                                env: env$7,
                                stack: UID$ReasonReactExamples.makeUIDConstructor("stack", /* Cons */[
                                      UID$ReasonReactExamples.makeUIDConstructor("frame", {
                                            ctxts: ctxts$7,
                                            env: env$7
                                          }),
                                      stack$7
                                    ])
                              }),
                          /* tuple */[
                            "bracket",
                            Flow$Sidewinder.fromArray([
                                  /* tuple */[
                                    e_uid$1,
                                    /* :: */[
                                      e_uid$1,
                                      /* [] */0
                                    ]
                                  ],
                                  /* tuple */[
                                    ctxts_uid$7,
                                    /* :: */[
                                      ctxts_uid$7,
                                      /* [] */0
                                    ]
                                  ],
                                  /* tuple */[
                                    env_uid$7,
                                    /* :: */[
                                      env_uid$7,
                                      /* [] */0
                                    ]
                                  ],
                                  /* tuple */[
                                    stack_uid$7,
                                    /* :: */[
                                      stack_uid$7,
                                      /* [] */0
                                    ]
                                  ]
                                ])
                          ]
                        ];
              
            }
          }
        } else {
          var ae = match$6[0][1];
          if (ae.tag) {
            var match$17 = match$5.values[1];
            if (!match$17) {
              return ;
            }
            if (match$17[1][1]) {
              return ;
            }
            var stack$8 = c.stack;
            var stack_uid$8 = stack$8[0];
            var env$8 = c.env;
            var env_uid$8 = env$8[0];
            var ctxts$8 = match.ctxts;
            var ctxts_uid$8 = ctxts$8[0];
            var v1 = match$17[0];
            var v1_uid = v1[0];
            var e2 = ae[1];
            var e2_uid = e2[0];
            var x$3 = ae[0];
            var x_uid$1 = x$3[0];
            return /* tuple */[
                    UID$ReasonReactExamples.makeUIDConstructor("config", {
                          zipper: UID$ReasonReactExamples.makeUIDConstructor("zipper", {
                                focus: UID$ReasonReactExamples.makeUIDConstructor("focus", /* ZExp */Block.__(0, [e2])),
                                ctxts: ctxts$8
                              }),
                          env: UID$ReasonReactExamples.makeUIDConstructor("env", /* Cons */[
                                UID$ReasonReactExamples.makeUIDConstructor("binding", {
                                      vid: x$3,
                                      value: v1
                                    }),
                                env$8
                              ]),
                          stack: stack$8
                        }),
                    /* tuple */[
                      "let",
                      Flow$Sidewinder.fromArray([
                            /* tuple */[
                              x_uid$1,
                              /* :: */[
                                x_uid$1,
                                /* [] */0
                              ]
                            ],
                            /* tuple */[
                              e2_uid,
                              /* :: */[
                                e2_uid,
                                /* [] */0
                              ]
                            ],
                            /* tuple */[
                              v1_uid,
                              /* :: */[
                                v1_uid,
                                /* [] */0
                              ]
                            ],
                            /* tuple */[
                              ctxts_uid$8,
                              /* :: */[
                                ctxts_uid$8,
                                /* [] */0
                              ]
                            ],
                            /* tuple */[
                              env_uid$8,
                              /* :: */[
                                env_uid$8,
                                /* [] */0
                              ]
                            ],
                            /* tuple */[
                              stack_uid$8,
                              /* :: */[
                                stack_uid$8,
                                /* [] */0
                              ]
                            ]
                          ])
                    ]
                  ];
          }
          if (match$5.values[1]) {
            return ;
          }
          var stack$9 = c.stack;
          var stack_uid$9 = stack$9[0];
          var env$9 = c.env;
          var env_uid$9 = env$9[0];
          var ctxts$9 = match.ctxts;
          var ctxts_uid$9 = ctxts$9[0];
          var ae$1 = ae[0];
          var ae_uid = ae$1[0];
          return /* tuple */[
                  UID$ReasonReactExamples.makeUIDConstructor("config", {
                        zipper: UID$ReasonReactExamples.makeUIDConstructor("zipper", {
                              focus: UID$ReasonReactExamples.makeUIDConstructor("focus", /* ZExp */Block.__(0, [ae$1])),
                              ctxts: ctxts$9
                            }),
                        env: env$9,
                        stack: stack$9
                      }),
                  /* tuple */[
                    "lift",
                    Flow$Sidewinder.fromArray([
                          /* tuple */[
                            ae_uid,
                            /* :: */[
                              ae_uid,
                              /* [] */0
                            ]
                          ],
                          /* tuple */[
                            ctxts_uid$9,
                            /* :: */[
                              ctxts_uid$9,
                              /* [] */0
                            ]
                          ],
                          /* tuple */[
                            env_uid$9,
                            /* :: */[
                              env_uid$9,
                              /* [] */0
                            ]
                          ],
                          /* tuple */[
                            stack_uid$9,
                            /* :: */[
                              stack_uid$9,
                              /* [] */0
                            ]
                          ]
                        ])
                  ]
                ];
        }
    case /* Value */2 :
        var match$18 = match.ctxts[1];
        var v$1 = v[0];
        var v_uid = v$1[0];
        if (match$18) {
          var match$19 = match$18[0][1];
          var match$20 = match$19.args[1];
          var op$1 = match$19.op;
          var op_uid$1 = op$1[0];
          if (match$20) {
            var stack$10 = c.stack;
            var stack_uid$10 = stack$10[0];
            var env$10 = c.env;
            var env_uid$10 = env$10[0];
            var ctxts$10 = match$18[1];
            var ctxts_uid$10 = ctxts$10[0];
            var values = match$19.values;
            var values_uid = values[0];
            var args$1 = match$20[1];
            var args_uid$1 = args$1[0];
            var a$1 = match$20[0];
            var a_uid$1 = a$1[0];
            return /* tuple */[
                    UID$ReasonReactExamples.makeUIDConstructor("config", {
                          zipper: UID$ReasonReactExamples.makeUIDConstructor("zipper", {
                                focus: UID$ReasonReactExamples.makeUIDConstructor("focus", /* ZExp */Block.__(0, [a$1])),
                                ctxts: UID$ReasonReactExamples.makeUIDConstructor("ctxts", /* Cons */[
                                      UID$ReasonReactExamples.makeUIDConstructor("zctxt", {
                                            op: op$1,
                                            args: args$1,
                                            values: UID$ReasonReactExamples.makeUIDConstructor("values", /* Cons */[
                                                  v$1,
                                                  values
                                                ])
                                          }),
                                      ctxts$10
                                    ])
                              }),
                          env: env$10,
                          stack: stack$10
                        }),
                    /* tuple */[
                      "zipper continue",
                      Flow$Sidewinder.fromArray([
                            /* tuple */[
                              v_uid,
                              /* :: */[
                                v_uid,
                                /* [] */0
                              ]
                            ],
                            /* tuple */[
                              op_uid$1,
                              /* :: */[
                                op_uid$1,
                                /* [] */0
                              ]
                            ],
                            /* tuple */[
                              a_uid$1,
                              /* :: */[
                                a_uid$1,
                                /* [] */0
                              ]
                            ],
                            /* tuple */[
                              args_uid$1,
                              /* :: */[
                                args_uid$1,
                                /* [] */0
                              ]
                            ],
                            /* tuple */[
                              values_uid,
                              /* :: */[
                                values_uid,
                                /* [] */0
                              ]
                            ],
                            /* tuple */[
                              ctxts_uid$10,
                              /* :: */[
                                ctxts_uid$10,
                                /* [] */0
                              ]
                            ],
                            /* tuple */[
                              env_uid$10,
                              /* :: */[
                                env_uid$10,
                                /* [] */0
                              ]
                            ],
                            /* tuple */[
                              stack_uid$10,
                              /* :: */[
                                stack_uid$10,
                                /* [] */0
                              ]
                            ]
                          ])
                    ]
                  ];
          }
          var stack$11 = c.stack;
          var stack_uid$11 = stack$11[0];
          var env$11 = c.env;
          var env_uid$11 = env$11[0];
          var ctxts$11 = match$18[1];
          var ctxts_uid$11 = ctxts$11[0];
          var values$1 = match$19.values;
          var values_uid$1 = values$1[0];
          return /* tuple */[
                  UID$ReasonReactExamples.makeUIDConstructor("config", {
                        zipper: UID$ReasonReactExamples.makeUIDConstructor("zipper", {
                              focus: UID$ReasonReactExamples.makeUIDConstructor("focus", /* ZPreVal */Block.__(1, [UID$ReasonReactExamples.makeUIDConstructor("zpreval", {
                                            op: op$1,
                                            values: UID$ReasonReactExamples.makeUIDConstructor("values", /* Cons */[
                                                  v$1,
                                                  values$1
                                                ])
                                          })])),
                              ctxts: ctxts$11
                            }),
                        env: env$11,
                        stack: stack$11
                      }),
                  /* tuple */[
                    "zipper end",
                    Flow$Sidewinder.fromArray([
                          /* tuple */[
                            v_uid,
                            /* :: */[
                              v_uid,
                              /* [] */0
                            ]
                          ],
                          /* tuple */[
                            op_uid$1,
                            /* :: */[
                              op_uid$1,
                              /* [] */0
                            ]
                          ],
                          /* tuple */[
                            values_uid$1,
                            /* :: */[
                              values_uid$1,
                              /* [] */0
                            ]
                          ],
                          /* tuple */[
                            ctxts_uid$11,
                            /* :: */[
                              ctxts_uid$11,
                              /* [] */0
                            ]
                          ],
                          /* tuple */[
                            env_uid$11,
                            /* :: */[
                              env_uid$11,
                              /* [] */0
                            ]
                          ],
                          /* tuple */[
                            stack_uid$11,
                            /* :: */[
                              stack_uid$11,
                              /* [] */0
                            ]
                          ]
                        ])
                  ]
                ];
        }
        var match$21 = c.stack[1];
        if (!match$21) {
          return ;
        }
        var stack$12 = match$21[1];
        var stack_uid$12 = stack$12[0];
        var match$22 = match$21[0][1];
        var env$prime$1 = match$22.env;
        var env$prime_uid$1 = env$prime$1[0];
        var ctxts$12 = match$22.ctxts;
        var ctxts_uid$12 = ctxts$12[0];
        return /* tuple */[
                UID$ReasonReactExamples.makeUIDConstructor("config", {
                      zipper: UID$ReasonReactExamples.makeUIDConstructor("zipper", {
                            focus: UID$ReasonReactExamples.makeUIDConstructor("focus", /* Value */Block.__(2, [v$1])),
                            ctxts: ctxts$12
                          }),
                      env: env$prime$1,
                      stack: stack$12
                    }),
                /* tuple */[
                  "app exit",
                  Flow$Sidewinder.fromArray([
                        /* tuple */[
                          v_uid,
                          /* :: */[
                            v_uid,
                            /* [] */0
                          ]
                        ],
                        /* tuple */[
                          c.env[0],
                          /* [] */0
                        ],
                        /* tuple */[
                          ctxts_uid$12,
                          /* :: */[
                            ctxts_uid$12,
                            /* [] */0
                          ]
                        ],
                        /* tuple */[
                          env$prime_uid$1,
                          /* :: */[
                            env$prime_uid$1,
                            /* [] */0
                          ]
                        ],
                        /* tuple */[
                          stack_uid$12,
                          /* :: */[
                            stack_uid$12,
                            /* [] */0
                          ]
                        ]
                      ])
                ]
              ];
    
  }
}

function inject(e) {
  return configToUID({
              zipper: {
                focus: /* ZExp */Block.__(0, [e]),
                ctxts: /* [] */0
              },
              env: /* [] */0,
              stack: /* [] */0
            });
}

function isFinal(param) {
  var c = param[1];
  var match = c.zipper[1];
  switch (match.focus[1].tag | 0) {
    case /* ZExp */0 :
    case /* ZPreVal */1 :
        return false;
    case /* Value */2 :
        if (match.ctxts[1] || c.stack[1]) {
          return false;
        } else {
          return true;
        }
    
  }
}

function iterateMaybeAux(f, x) {
  if (x === undefined) {
    return /* [] */0;
  }
  var x$1 = Caml_option.valFromOption(x);
  var fx = Curry._1(f, x$1);
  return /* :: */[
          x$1,
          iterateMaybeAux(f, fx)
        ];
}

function takeWhileInclusive(p, l) {
  if (!l) {
    return /* [] */0;
  }
  var x = l[0];
  return /* :: */[
          x,
          Curry._1(p, x) ? takeWhileInclusive(p, l[1]) : /* [] */0
        ];
}

function iterateMaybe(f, x) {
  return iterateMaybeAux(f, Caml_option.some(x));
}

function iterateMaybeSideEffect(f, x) {
  var match = Curry._1(f, x);
  if (match === undefined) {
    return /* tuple */[
            /* :: */[
              x,
              /* [] */0
            ],
            /* [] */0
          ];
  }
  var match$1 = iterateMaybeSideEffect(f, match[0]);
  return /* tuple */[
          /* :: */[
            x,
            match$1[0]
          ],
          /* :: */[
            match[1],
            match$1[1]
          ]
        ];
}

function interpretTrace(p) {
  var match = iterateMaybeSideEffect(step, inject(p));
  var rules = match[1];
  var match$1 = List.split(rules);
  console.log("rules", $$Array.of_list(List.combine(match$1[0], List.map(Flow$Sidewinder.toArray, match$1[1]))));
  return List.combine(Pervasives.$at(rules, /* :: */[
                  /* tuple */[
                    "",
                    Flow$Sidewinder.none
                  ],
                  /* [] */0
                ]), takeWhileInclusive((function (c) {
                    return !isFinal(c);
                  }), match[0]));
}

function interpret(p) {
  var match = List.hd(List.rev(interpretTrace(p)));
  var v = match[1][1].zipper[1].focus[1];
  switch (v.tag | 0) {
    case /* ZExp */0 :
    case /* ZPreVal */1 :
        throw Pervasives.failwith("expected a value");
    case /* Value */2 :
        return valueFromUID(v[0]);
    
  }
}

var advance = step;

exports.mkVid = mkVid;
exports.mkInt = mkInt;
exports.mkZExp = mkZExp;
exports.mkZCtxt = mkZCtxt;
exports.mkZPreVal = mkZPreVal;
exports.mkLambda = mkLambda;
exports.mkAExpOp = mkAExpOp;
exports.mkAExp = mkAExp;
exports.mkAExps = mkAExps;
exports.mkExpOp = mkExpOp;
exports.mkExp = mkExp;
exports.mkOp = mkOp;
exports.mkValue = mkValue;
exports.mkValues = mkValues;
exports.mkBinding = mkBinding;
exports.mkEnv = mkEnv;
exports.mkFocus = mkFocus;
exports.mkCtxts = mkCtxts;
exports.mkZipper = mkZipper;
exports.mkFrame = mkFrame;
exports.mkStack = mkStack;
exports.mkConfig = mkConfig;
exports.vidToUID = vidToUID;
exports.intToUID = intToUID;
exports.zexpToUID = zexpToUID;
exports.zctxtToUID = zctxtToUID;
exports.zprevalToUID = zprevalToUID;
exports.lambdaToUID = lambdaToUID;
exports.aexp_opToUID = aexp_opToUID;
exports.aexpToUID = aexpToUID;
exports.aexpsToUID = aexpsToUID;
exports.exp_opToUID = exp_opToUID;
exports.expToUID = expToUID;
exports.opToUID = opToUID;
exports.valueToUID = valueToUID;
exports.valuesToUID = valuesToUID;
exports.bindingToUID = bindingToUID;
exports.envToUID = envToUID;
exports.focusToUID = focusToUID;
exports.ctxtsToUID = ctxtsToUID;
exports.zipperToUID = zipperToUID;
exports.frameToUID = frameToUID;
exports.stackToUID = stackToUID;
exports.configToUID = configToUID;
exports.vidFromUID = vidFromUID;
exports.intFromUID = intFromUID;
exports.zexpFromUID = zexpFromUID;
exports.zctxtFromUID = zctxtFromUID;
exports.zprevalFromUID = zprevalFromUID;
exports.lambdaFromUID = lambdaFromUID;
exports.aexp_opFromUID = aexp_opFromUID;
exports.aexpFromUID = aexpFromUID;
exports.aexpsFromUID = aexpsFromUID;
exports.exp_opFromUID = exp_opFromUID;
exports.expFromUID = expFromUID;
exports.opFromUID = opFromUID;
exports.valueFromUID = valueFromUID;
exports.valuesFromUID = valuesFromUID;
exports.bindingFromUID = bindingFromUID;
exports.envFromUID = envFromUID;
exports.focusFromUID = focusFromUID;
exports.ctxtsFromUID = ctxtsFromUID;
exports.zipperFromUID = zipperFromUID;
exports.frameFromUID = frameFromUID;
exports.stackFromUID = stackFromUID;
exports.configFromUID = configFromUID;
exports.lookup = lookup;
exports.step = step;
exports.inject = inject;
exports.isFinal = isFinal;
exports.iterateMaybeAux = iterateMaybeAux;
exports.advance = advance;
exports.takeWhileInclusive = takeWhileInclusive;
exports.iterateMaybe = iterateMaybe;
exports.iterateMaybeSideEffect = iterateMaybeSideEffect;
exports.interpretTrace = interpretTrace;
exports.interpret = interpret;
/* No side effect */
