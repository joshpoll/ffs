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
  var ze_op = Curry._1(opToUID, param.op);
  var ze_args = aexpsToUID(param.args);
  var ze = {
    op: ze_op,
    args: ze_args
  };
  return UID$ReasonReactExamples.makeUIDConstructor("zexp", ze);
}

function opToUID(o) {
  var o$1;
  o$1 = o.tag ? /* AExp */Block.__(1, [aexp_opToUID(o[0])]) : /* Exp */Block.__(0, [exp_opToUID(o[0])]);
  return UID$ReasonReactExamples.makeUIDConstructor("op", o$1);
}

function aexpsToUID(aes) {
  var aes$1 = aes ? /* Cons */[
      zexpToUID(opToUID, aes[0]),
      aexpsToUID(aes[1])
    ] : /* Empty */0;
  return UID$ReasonReactExamples.makeUIDConstructor("aexps", aes$1);
}

function zprevalToUID(opToUID, param) {
  var zp_op = Curry._1(opToUID, param.op);
  var zp_values = valuesToUID(param.values);
  var zp = {
    op: zp_op,
    values: zp_values
  };
  return UID$ReasonReactExamples.makeUIDConstructor("zpreval", zp);
}

function valueToUID(v) {
  var v$1;
  v$1 = v.tag ? /* Clo */Block.__(1, [
        lambdaToUID(v[0]),
        envToUID(v[1])
      ]) : /* VNum */Block.__(0, [UID$ReasonReactExamples.makeUIDConstructor("int", v[0])]);
  return UID$ReasonReactExamples.makeUIDConstructor("value", v$1);
}

function bindingToUID(param) {
  var b_vid = UID$ReasonReactExamples.makeUIDConstructor("vid", param.vid);
  var b_value = valueToUID(param.value);
  var b = {
    vid: b_vid,
    value: b_value
  };
  return UID$ReasonReactExamples.makeUIDConstructor("binding", b);
}

function envToUID(e) {
  var e$1 = e ? /* Cons */[
      bindingToUID(e[0]),
      envToUID(e[1])
    ] : /* Empty */0;
  return UID$ReasonReactExamples.makeUIDConstructor("env", e$1);
}

function stackToUID(s) {
  var s$1 = s ? /* Cons */[
      frameToUID(s[0]),
      stackToUID(s[1])
    ] : /* Empty */0;
  return UID$ReasonReactExamples.makeUIDConstructor("stack", s$1);
}

function frameToUID(param) {
  var f_ctxts = ctxtsToUID(param.ctxts);
  var f_env = envToUID(param.env);
  var f = {
    ctxts: f_ctxts,
    env: f_env
  };
  return UID$ReasonReactExamples.makeUIDConstructor("frame", f);
}

function valuesToUID(vs) {
  var vs$1 = vs ? /* Cons */[
      valueToUID(vs[0]),
      valuesToUID(vs[1])
    ] : /* Empty */0;
  return UID$ReasonReactExamples.makeUIDConstructor("values", vs$1);
}

function zctxtToUID(opToUID, param) {
  var zc_op = Curry._1(opToUID, param.op);
  var zc_args = aexpsToUID(param.args);
  var zc_values = valuesToUID(param.values);
  var zc = {
    op: zc_op,
    args: zc_args,
    values: zc_values
  };
  return UID$ReasonReactExamples.makeUIDConstructor("zctxt", zc);
}

function ctxtsToUID(cs) {
  var cs$1 = cs ? /* Cons */[
      zctxtToUID(opToUID, cs[0]),
      ctxtsToUID(cs[1])
    ] : /* Empty */0;
  return UID$ReasonReactExamples.makeUIDConstructor("ctxts", cs$1);
}

function lambdaToUID(param) {
  var l_vid = UID$ReasonReactExamples.makeUIDConstructor("vid", param.vid);
  var l_exp = zexpToUID(opToUID, param.exp);
  var l = {
    vid: l_vid,
    exp: l_exp
  };
  return UID$ReasonReactExamples.makeUIDConstructor("lambda", l);
}

function aexp_opToUID(aeo) {
  var aeo$1;
  if (typeof aeo === "number") {
    aeo$1 = aeo === /* App */0 ? /* App */0 : /* Add */1;
  } else {
    switch (aeo.tag | 0) {
      case /* Var */0 :
          aeo$1 = /* Var */Block.__(0, [UID$ReasonReactExamples.makeUIDConstructor("vid", aeo[0])]);
          break;
      case /* Lam */1 :
          aeo$1 = /* Lam */Block.__(1, [lambdaToUID(aeo[0])]);
          break;
      case /* Num */2 :
          aeo$1 = /* Num */Block.__(2, [UID$ReasonReactExamples.makeUIDConstructor("int", aeo[0])]);
          break;
      case /* Bracket */3 :
          aeo$1 = /* Bracket */Block.__(3, [zexpToUID(opToUID, aeo[0])]);
          break;
      
    }
  }
  return UID$ReasonReactExamples.makeUIDConstructor("aexp_op", aeo$1);
}

function exp_opToUID(eo) {
  var eo$1;
  eo$1 = eo.tag ? /* Let */Block.__(1, [
        UID$ReasonReactExamples.makeUIDConstructor("vid", eo[0]),
        zexpToUID(opToUID, eo[1])
      ]) : /* Lift */Block.__(0, [zexpToUID(opToUID, eo[0])]);
  return UID$ReasonReactExamples.makeUIDConstructor("exp_op", eo$1);
}

function focusToUID(f) {
  var f$1;
  switch (f.tag | 0) {
    case /* ZExp */0 :
        f$1 = /* ZExp */Block.__(0, [zexpToUID(opToUID, f[0])]);
        break;
    case /* ZPreVal */1 :
        f$1 = /* ZPreVal */Block.__(1, [zprevalToUID(opToUID, f[0])]);
        break;
    case /* Value */2 :
        f$1 = /* Value */Block.__(2, [valueToUID(f[0])]);
        break;
    
  }
  return UID$ReasonReactExamples.makeUIDConstructor("focus", f$1);
}

function aexpToUID(ae) {
  return zexpToUID(opToUID, ae);
}

function expToUID(e) {
  return zexpToUID(opToUID, e);
}

function zipperToUID(param) {
  var z_focus = focusToUID(param.focus);
  var z_ctxts = ctxtsToUID(param.ctxts);
  var z = {
    focus: z_focus,
    ctxts: z_ctxts
  };
  return UID$ReasonReactExamples.makeUIDConstructor("zipper", z);
}

function configToUID(param) {
  var c_zipper = zipperToUID(param.zipper);
  var c_env = envToUID(param.env);
  var c_stack = stackToUID(param.stack);
  var c = {
    zipper: c_zipper,
    env: c_env,
    stack: c_stack
  };
  return UID$ReasonReactExamples.makeUIDConstructor("config", c);
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
  } else {
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
    if (env_val) {
      var match = env_val[0][1];
      var match$1 = match.value;
      var v_val = match$1[1];
      var v_uid = match$1[0];
      if (x[1] === match.vid[1]) {
        var fresh = "valLookup_" + UID$ReasonReactExamples.rauc(/* () */0);
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
                          "valLookup_int_" + UID$ReasonReactExamples.rauc(/* () */0),
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
      } else {
        _env = /* tuple */[
          env[0],
          env_val[1][1]
        ];
        continue ;
      }
    } else {
      return ;
    }
  };
}

function step(param) {
  var c = param[1];
  var match = c.zipper[1];
  var match$1 = match.focus[1];
  switch (match$1.tag | 0) {
    case /* ZExp */0 :
        var match$2 = match$1[0][1];
        var op = match$2.op;
        var match$3 = op[1];
        var op_uid = op[0];
        if (match$3.tag) {
          var match$4 = match$3[0][1];
          if (typeof match$4 !== "number") {
            switch (match$4.tag | 0) {
              case /* Var */0 :
                  if (!match$2.args[1]) {
                    var stack = c.stack;
                    var stack_uid = stack[0];
                    var env = c.env;
                    var env_uid = env[0];
                    var ctxts = match.ctxts;
                    var ctxts_uid = ctxts[0];
                    var x = match$4[0];
                    var match$5 = lookup(x, env);
                    if (match$5 !== undefined) {
                      var match$6 = match$5;
                      var z_focus = UID$ReasonReactExamples.makeUIDConstructor("focus", /* Value */Block.__(2, [match$6[0]]));
                      var z = {
                        focus: z_focus,
                        ctxts: ctxts
                      };
                      var c_zipper = UID$ReasonReactExamples.makeUIDConstructor("zipper", z);
                      var c$1 = {
                        zipper: c_zipper,
                        env: env,
                        stack: stack
                      };
                      return /* tuple */[
                              UID$ReasonReactExamples.makeUIDConstructor("config", c$1),
                              /* tuple */[
                                "var",
                                Flow$Sidewinder.union(Flow$Sidewinder.fromArray([
                                          /* tuple */[
                                            x[0],
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
                                        ]), match$6[1])
                              ]
                            ];
                    } else {
                      return ;
                    }
                  }
                  break;
              case /* Lam */1 :
                  if (!match$2.args[1]) {
                    var stack$1 = c.stack;
                    var stack_uid$1 = stack$1[0];
                    var env$1 = c.env;
                    var env_uid$1 = env$1[0];
                    var ctxts$1 = match.ctxts;
                    var ctxts_uid$1 = ctxts$1[0];
                    var l = match$4[0];
                    var l_uid = l[0];
                    var env2 = envToUID(envFromUID(env$1));
                    var f = /* Value */Block.__(2, [UID$ReasonReactExamples.makeUIDConstructor("value", /* Clo */Block.__(1, [
                                l,
                                env2
                              ]))]);
                    var z_focus$1 = UID$ReasonReactExamples.makeUIDConstructor("focus", f);
                    var z$1 = {
                      focus: z_focus$1,
                      ctxts: ctxts$1
                    };
                    var c_zipper$1 = UID$ReasonReactExamples.makeUIDConstructor("zipper", z$1);
                    var c$2 = {
                      zipper: c_zipper$1,
                      env: env$1,
                      stack: stack$1
                    };
                    return /* tuple */[
                            UID$ReasonReactExamples.makeUIDConstructor("config", c$2),
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
        var match$7 = match$2.args[1];
        if (match$7) {
          var stack$2 = c.stack;
          var stack_uid$2 = stack$2[0];
          var env$2 = c.env;
          var env_uid$2 = env$2[0];
          var ctxts$2 = match.ctxts;
          var ctxts_uid$2 = ctxts$2[0];
          var args = match$7[1];
          var args_uid = args[0];
          var a = match$7[0];
          var a_uid = a[0];
          var zc_values = UID$ReasonReactExamples.makeUIDConstructor("values", /* Empty */0);
          var zc = {
            op: op,
            args: args,
            values: zc_values
          };
          var cs_000 = UID$ReasonReactExamples.makeUIDConstructor("zctxt", zc);
          var cs = /* Cons */[
            cs_000,
            ctxts$2
          ];
          var z_focus$2 = UID$ReasonReactExamples.makeUIDConstructor("focus", /* ZExp */Block.__(0, [a]));
          var z_ctxts = UID$ReasonReactExamples.makeUIDConstructor("ctxts", cs);
          var z$2 = {
            focus: z_focus$2,
            ctxts: z_ctxts
          };
          var c_zipper$2 = UID$ReasonReactExamples.makeUIDConstructor("zipper", z$2);
          var c$3 = {
            zipper: c_zipper$2,
            env: env$2,
            stack: stack$2
          };
          return /* tuple */[
                  UID$ReasonReactExamples.makeUIDConstructor("config", c$3),
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
        } else {
          var stack$3 = c.stack;
          var stack_uid$3 = stack$3[0];
          var env$3 = c.env;
          var env_uid$3 = env$3[0];
          var ctxts$3 = match.ctxts;
          var ctxts_uid$3 = ctxts$3[0];
          var zp_values = UID$ReasonReactExamples.makeUIDConstructor("values", /* Empty */0);
          var zp = {
            op: op,
            values: zp_values
          };
          var f$1 = /* ZPreVal */Block.__(1, [UID$ReasonReactExamples.makeUIDConstructor("zpreval", zp)]);
          var z_focus$3 = UID$ReasonReactExamples.makeUIDConstructor("focus", f$1);
          var z$3 = {
            focus: z_focus$3,
            ctxts: ctxts$3
          };
          var c_zipper$3 = UID$ReasonReactExamples.makeUIDConstructor("zipper", z$3);
          var c$4 = {
            zipper: c_zipper$3,
            env: env$3,
            stack: stack$3
          };
          return /* tuple */[
                  UID$ReasonReactExamples.makeUIDConstructor("config", c$4),
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
        }
        break;
    case /* ZPreVal */1 :
        var match$8 = match$1[0][1];
        var match$9 = match$8.op[1];
        if (match$9.tag) {
          var match$10 = match$9[0][1];
          if (typeof match$10 === "number") {
            if (match$10 === /* App */0) {
              var match$11 = match$8.values[1];
              if (match$11) {
                var match$12 = match$11[1][1];
                if (match$12) {
                  var match$13 = match$12[0][1];
                  var v2 = match$11[0];
                  var v2_uid = v2[0];
                  if (match$13.tag && !match$12[1][1]) {
                    var stack$4 = c.stack;
                    var stack_uid$4 = stack$4[0];
                    var env$prime = c.env;
                    var env$prime_uid = env$prime[0];
                    var ctxts$4 = match.ctxts;
                    var ctxts_uid$4 = ctxts$4[0];
                    var env$4 = match$13[1];
                    var env_uid$4 = env$4[0];
                    var match$14 = match$13[0][1];
                    var e = match$14.exp;
                    var e_uid = e[0];
                    var x$1 = match$14.vid;
                    var x_uid = x$1[0];
                    var z_focus$4 = UID$ReasonReactExamples.makeUIDConstructor("focus", /* ZExp */Block.__(0, [e]));
                    var z_ctxts$1 = UID$ReasonReactExamples.makeUIDConstructor("ctxts", /* Empty */0);
                    var z$4 = {
                      focus: z_focus$4,
                      ctxts: z_ctxts$1
                    };
                    var e_000 = UID$ReasonReactExamples.makeUIDConstructor("binding", {
                          vid: x$1,
                          value: v2
                        });
                    var e$1 = /* Cons */[
                      e_000,
                      env$4
                    ];
                    var s_000 = UID$ReasonReactExamples.makeUIDConstructor("frame", {
                          ctxts: ctxts$4,
                          env: env$prime
                        });
                    var s = /* Cons */[
                      s_000,
                      stack$4
                    ];
                    var c_zipper$4 = UID$ReasonReactExamples.makeUIDConstructor("zipper", z$4);
                    var c_env = UID$ReasonReactExamples.makeUIDConstructor("env", e$1);
                    var c_stack = UID$ReasonReactExamples.makeUIDConstructor("stack", s);
                    var c$5 = {
                      zipper: c_zipper$4,
                      env: c_env,
                      stack: c_stack
                    };
                    return /* tuple */[
                            UID$ReasonReactExamples.makeUIDConstructor("config", c$5),
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
                  } else {
                    return ;
                  }
                } else {
                  return ;
                }
              } else {
                return ;
              }
            } else {
              var match$15 = match$8.values[1];
              if (match$15) {
                var match$16 = match$15[0][1];
                if (match$16.tag) {
                  return ;
                } else {
                  var match$17 = match$15[1][1];
                  if (match$17) {
                    var match$18 = match$17[0][1];
                    var match$19 = match$16[0];
                    if (match$18.tag || match$17[1][1]) {
                      return ;
                    } else {
                      var stack$5 = c.stack;
                      var stack_uid$5 = stack$5[0];
                      var env$5 = c.env;
                      var env_uid$5 = env$5[0];
                      var ctxts$5 = match.ctxts;
                      var ctxts_uid$5 = ctxts$5[0];
                      var match$20 = match$18[0];
                      var v3 = UID$ReasonReactExamples.makeUIDConstructor("int", match$20[1] + match$19[1] | 0);
                      var v3_uid = v3[0];
                      var f$2 = /* Value */Block.__(2, [UID$ReasonReactExamples.makeUIDConstructor("value", /* VNum */Block.__(0, [v3]))]);
                      var z_focus$5 = UID$ReasonReactExamples.makeUIDConstructor("focus", f$2);
                      var z$5 = {
                        focus: z_focus$5,
                        ctxts: ctxts$5
                      };
                      var c_zipper$5 = UID$ReasonReactExamples.makeUIDConstructor("zipper", z$5);
                      var c$6 = {
                        zipper: c_zipper$5,
                        env: env$5,
                        stack: stack$5
                      };
                      return /* tuple */[
                              UID$ReasonReactExamples.makeUIDConstructor("config", c$6),
                              /* tuple */[
                                "add",
                                Flow$Sidewinder.fromArray([
                                      /* tuple */[
                                        match$20[0],
                                        /* :: */[
                                          v3_uid,
                                          /* [] */0
                                        ]
                                      ],
                                      /* tuple */[
                                        match$19[0],
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
                    }
                  } else {
                    return ;
                  }
                }
              } else {
                return ;
              }
            }
          } else {
            switch (match$10.tag | 0) {
              case /* Var */0 :
              case /* Lam */1 :
                  return ;
              case /* Num */2 :
                  if (match$8.values[1]) {
                    return ;
                  } else {
                    var stack$6 = c.stack;
                    var stack_uid$6 = stack$6[0];
                    var env$6 = c.env;
                    var env_uid$6 = env$6[0];
                    var ctxts$6 = match.ctxts;
                    var ctxts_uid$6 = ctxts$6[0];
                    var n = match$10[0];
                    var n_uid = n[0];
                    var f$3 = /* Value */Block.__(2, [UID$ReasonReactExamples.makeUIDConstructor("value", /* VNum */Block.__(0, [n]))]);
                    var z_focus$6 = UID$ReasonReactExamples.makeUIDConstructor("focus", f$3);
                    var z$6 = {
                      focus: z_focus$6,
                      ctxts: ctxts$6
                    };
                    var c_zipper$6 = UID$ReasonReactExamples.makeUIDConstructor("zipper", z$6);
                    var c$7 = {
                      zipper: c_zipper$6,
                      env: env$6,
                      stack: stack$6
                    };
                    return /* tuple */[
                            UID$ReasonReactExamples.makeUIDConstructor("config", c$7),
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
                  }
              case /* Bracket */3 :
                  if (match$8.values[1]) {
                    return ;
                  } else {
                    var stack$7 = c.stack;
                    var stack_uid$7 = stack$7[0];
                    var env$7 = c.env;
                    var env_uid$7 = env$7[0];
                    var ctxts$7 = match.ctxts;
                    var ctxts_uid$7 = ctxts$7[0];
                    var e$2 = match$10[0];
                    var e_uid$1 = e$2[0];
                    var z_focus$7 = UID$ReasonReactExamples.makeUIDConstructor("focus", /* ZExp */Block.__(0, [e$2]));
                    var z_ctxts$2 = UID$ReasonReactExamples.makeUIDConstructor("ctxts", /* Empty */0);
                    var z$7 = {
                      focus: z_focus$7,
                      ctxts: z_ctxts$2
                    };
                    var s_000$1 = UID$ReasonReactExamples.makeUIDConstructor("frame", {
                          ctxts: ctxts$7,
                          env: env$7
                        });
                    var s$1 = /* Cons */[
                      s_000$1,
                      stack$7
                    ];
                    var c_zipper$7 = UID$ReasonReactExamples.makeUIDConstructor("zipper", z$7);
                    var c_stack$1 = UID$ReasonReactExamples.makeUIDConstructor("stack", s$1);
                    var c$8 = {
                      zipper: c_zipper$7,
                      env: env$7,
                      stack: c_stack$1
                    };
                    return /* tuple */[
                            UID$ReasonReactExamples.makeUIDConstructor("config", c$8),
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
          }
        } else {
          var match$21 = match$9[0][1];
          if (match$21.tag) {
            var match$22 = match$8.values[1];
            if (match$22 && !match$22[1][1]) {
              var stack$8 = c.stack;
              var stack_uid$8 = stack$8[0];
              var env$8 = c.env;
              var env_uid$8 = env$8[0];
              var ctxts$8 = match.ctxts;
              var ctxts_uid$8 = ctxts$8[0];
              var v1 = match$22[0];
              var v1_uid = v1[0];
              var e2 = match$21[1];
              var e2_uid = e2[0];
              var x$2 = match$21[0];
              var x_uid$1 = x$2[0];
              var z_focus$8 = UID$ReasonReactExamples.makeUIDConstructor("focus", /* ZExp */Block.__(0, [e2]));
              var z$8 = {
                focus: z_focus$8,
                ctxts: ctxts$8
              };
              var e_000$1 = UID$ReasonReactExamples.makeUIDConstructor("binding", {
                    vid: x$2,
                    value: v1
                  });
              var e$3 = /* Cons */[
                e_000$1,
                env$8
              ];
              var c_zipper$8 = UID$ReasonReactExamples.makeUIDConstructor("zipper", z$8);
              var c_env$1 = UID$ReasonReactExamples.makeUIDConstructor("env", e$3);
              var c$9 = {
                zipper: c_zipper$8,
                env: c_env$1,
                stack: stack$8
              };
              return /* tuple */[
                      UID$ReasonReactExamples.makeUIDConstructor("config", c$9),
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
            } else {
              return ;
            }
          } else if (match$8.values[1]) {
            return ;
          } else {
            var stack$9 = c.stack;
            var stack_uid$9 = stack$9[0];
            var env$9 = c.env;
            var env_uid$9 = env$9[0];
            var ctxts$9 = match.ctxts;
            var ctxts_uid$9 = ctxts$9[0];
            var ae = match$21[0];
            var ae_uid = ae[0];
            var z_focus$9 = UID$ReasonReactExamples.makeUIDConstructor("focus", /* ZExp */Block.__(0, [ae]));
            var z$9 = {
              focus: z_focus$9,
              ctxts: ctxts$9
            };
            var c_zipper$9 = UID$ReasonReactExamples.makeUIDConstructor("zipper", z$9);
            var c$10 = {
              zipper: c_zipper$9,
              env: env$9,
              stack: stack$9
            };
            return /* tuple */[
                    UID$ReasonReactExamples.makeUIDConstructor("config", c$10),
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
        }
    case /* Value */2 :
        var match$23 = match.ctxts[1];
        var v = match$1[0];
        var v_uid = v[0];
        if (match$23) {
          var match$24 = match$23[0][1];
          var match$25 = match$24.args[1];
          var op$1 = match$24.op;
          var op_uid$1 = op$1[0];
          if (match$25) {
            var stack$10 = c.stack;
            var stack_uid$10 = stack$10[0];
            var env$10 = c.env;
            var env_uid$10 = env$10[0];
            var ctxts$10 = match$23[1];
            var ctxts_uid$10 = ctxts$10[0];
            var values = match$24.values;
            var values_uid = values[0];
            var args$1 = match$25[1];
            var args_uid$1 = args$1[0];
            var a$1 = match$25[0];
            var a_uid$1 = a$1[0];
            var zc_values$1 = UID$ReasonReactExamples.makeUIDConstructor("values", /* Cons */[
                  v,
                  values
                ]);
            var zc$1 = {
              op: op$1,
              args: args$1,
              values: zc_values$1
            };
            var cs_000$1 = UID$ReasonReactExamples.makeUIDConstructor("zctxt", zc$1);
            var cs$1 = /* Cons */[
              cs_000$1,
              ctxts$10
            ];
            var z_focus$10 = UID$ReasonReactExamples.makeUIDConstructor("focus", /* ZExp */Block.__(0, [a$1]));
            var z_ctxts$3 = UID$ReasonReactExamples.makeUIDConstructor("ctxts", cs$1);
            var z$10 = {
              focus: z_focus$10,
              ctxts: z_ctxts$3
            };
            var c_zipper$10 = UID$ReasonReactExamples.makeUIDConstructor("zipper", z$10);
            var c$11 = {
              zipper: c_zipper$10,
              env: env$10,
              stack: stack$10
            };
            return /* tuple */[
                    UID$ReasonReactExamples.makeUIDConstructor("config", c$11),
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
          } else {
            var stack$11 = c.stack;
            var stack_uid$11 = stack$11[0];
            var env$11 = c.env;
            var env_uid$11 = env$11[0];
            var ctxts$11 = match$23[1];
            var ctxts_uid$11 = ctxts$11[0];
            var values$1 = match$24.values;
            var values_uid$1 = values$1[0];
            var zp_values$1 = UID$ReasonReactExamples.makeUIDConstructor("values", /* Cons */[
                  v,
                  values$1
                ]);
            var zp$1 = {
              op: op$1,
              values: zp_values$1
            };
            var f$4 = /* ZPreVal */Block.__(1, [UID$ReasonReactExamples.makeUIDConstructor("zpreval", zp$1)]);
            var z_focus$11 = UID$ReasonReactExamples.makeUIDConstructor("focus", f$4);
            var z$11 = {
              focus: z_focus$11,
              ctxts: ctxts$11
            };
            var c_zipper$11 = UID$ReasonReactExamples.makeUIDConstructor("zipper", z$11);
            var c$12 = {
              zipper: c_zipper$11,
              env: env$11,
              stack: stack$11
            };
            return /* tuple */[
                    UID$ReasonReactExamples.makeUIDConstructor("config", c$12),
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
        } else {
          var match$26 = c.stack[1];
          if (match$26) {
            var stack$12 = match$26[1];
            var stack_uid$12 = stack$12[0];
            var match$27 = match$26[0][1];
            var env$prime$1 = match$27.env;
            var env$prime_uid$1 = env$prime$1[0];
            var ctxts$12 = match$27.ctxts;
            var ctxts_uid$12 = ctxts$12[0];
            var z_focus$12 = UID$ReasonReactExamples.makeUIDConstructor("focus", /* Value */Block.__(2, [v]));
            var z$12 = {
              focus: z_focus$12,
              ctxts: ctxts$12
            };
            var c_zipper$12 = UID$ReasonReactExamples.makeUIDConstructor("zipper", z$12);
            var c$13 = {
              zipper: c_zipper$12,
              env: env$prime$1,
              stack: stack$12
            };
            return /* tuple */[
                    UID$ReasonReactExamples.makeUIDConstructor("config", c$13),
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
          } else {
            return ;
          }
        }
    
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
  if (x !== undefined) {
    var x$1 = Caml_option.valFromOption(x);
    var fx = Curry._1(f, x$1);
    return /* :: */[
            x$1,
            iterateMaybeAux(f, fx)
          ];
  } else {
    return /* [] */0;
  }
}

function takeWhileInclusive(p, l) {
  if (l) {
    var x = l[0];
    return /* :: */[
            x,
            Curry._1(p, x) ? takeWhileInclusive(p, l[1]) : /* [] */0
          ];
  } else {
    return /* [] */0;
  }
}

function iterateMaybe(f, x) {
  return iterateMaybeAux(f, Caml_option.some(x));
}

function iterateMaybeSideEffect(f, x) {
  var match = Curry._1(f, x);
  if (match !== undefined) {
    var match$1 = match;
    var match$2 = iterateMaybeSideEffect(f, match$1[0]);
    return /* tuple */[
            /* :: */[
              x,
              match$2[0]
            ],
            /* :: */[
              match$1[1],
              match$2[1]
            ]
          ];
  } else {
    return /* tuple */[
            /* :: */[
              x,
              /* [] */0
            ],
            /* [] */0
          ];
  }
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
  var match$1 = match[1][1].zipper[1].focus[1];
  switch (match$1.tag | 0) {
    case /* ZExp */0 :
    case /* ZPreVal */1 :
        throw Pervasives.failwith("expected a value");
    case /* Value */2 :
        return valueFromUID(match$1[0]);
    
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
