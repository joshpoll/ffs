'use strict';

var List = require("bs-platform/lib/js/list.js");
var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");

function lookup(x, _env) {
  while(true) {
    var env = _env;
    if (env) {
      var match = env[0];
      if (x === match.vid) {
        return match.value;
      } else {
        _env = env[1];
        continue ;
      }
    } else {
      return ;
    }
  };
}

function step(c) {
  var match = c.zipper;
  var match$1 = match.focus;
  switch (match$1.tag | 0) {
    case /* ZExp */0 :
        var match$2 = match$1[0];
        var op = match$2.op;
        if (op.tag) {
          var match$3 = op[0];
          if (typeof match$3 !== "number") {
            switch (match$3.tag | 0) {
              case /* Var */0 :
                  if (!match$2.args) {
                    var env = c.env;
                    var match$4 = lookup(match$3[0], env);
                    if (match$4 !== undefined) {
                      return {
                              zipper: {
                                focus: /* Value */Block.__(2, [match$4]),
                                ctxts: match.ctxts
                              },
                              env: env,
                              stack: c.stack
                            };
                    } else {
                      return ;
                    }
                  }
                  break;
              case /* Lam */1 :
                  if (!match$2.args) {
                    var env$1 = c.env;
                    return {
                            zipper: {
                              focus: /* Value */Block.__(2, [/* Clo */Block.__(1, [
                                      match$3[0],
                                      env$1
                                    ])]),
                              ctxts: match.ctxts
                            },
                            env: env$1,
                            stack: c.stack
                          };
                  }
                  break;
              default:
                
            }
          }
          
        }
        var match$5 = match$2.args;
        if (match$5) {
          return {
                  zipper: {
                    focus: /* ZExp */Block.__(0, [match$5[0]]),
                    ctxts: /* :: */[
                      {
                        op: op,
                        args: match$5[1],
                        values: /* [] */0
                      },
                      match.ctxts
                    ]
                  },
                  env: c.env,
                  stack: c.stack
                };
        } else {
          return {
                  zipper: {
                    focus: /* ZPreVal */Block.__(1, [{
                          op: op,
                          values: /* [] */0
                        }]),
                    ctxts: match.ctxts
                  },
                  env: c.env,
                  stack: c.stack
                };
        }
    case /* ZPreVal */1 :
        var match$6 = match$1[0];
        var match$7 = match$6.op;
        if (match$7.tag) {
          var match$8 = match$7[0];
          if (typeof match$8 === "number") {
            if (match$8 === /* App */0) {
              var match$9 = match$6.values;
              if (match$9) {
                var match$10 = match$9[0];
                if (match$10.tag) {
                  var match$11 = match$9[1];
                  if (match$11 && !match$11[1]) {
                    var match$12 = match$10[0];
                    return {
                            zipper: {
                              focus: /* ZExp */Block.__(0, [match$12.exp]),
                              ctxts: /* [] */0
                            },
                            env: /* :: */[
                              {
                                vid: match$12.vid,
                                value: match$11[0]
                              },
                              match$10[1]
                            ],
                            stack: /* :: */[
                              {
                                ctxts: match.ctxts,
                                env: c.env
                              },
                              c.stack
                            ]
                          };
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
              var match$13 = match$6.values;
              if (match$13) {
                var match$14 = match$13[0];
                if (match$14.tag) {
                  return ;
                } else {
                  var match$15 = match$13[1];
                  if (match$15) {
                    var match$16 = match$15[0];
                    if (match$16.tag || match$15[1]) {
                      return ;
                    } else {
                      var v3 = match$14[0] + match$16[0] | 0;
                      return {
                              zipper: {
                                focus: /* Value */Block.__(2, [/* VNum */Block.__(0, [v3])]),
                                ctxts: match.ctxts
                              },
                              env: c.env,
                              stack: c.stack
                            };
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
            switch (match$8.tag | 0) {
              case /* Var */0 :
              case /* Lam */1 :
                  return ;
              case /* Num */2 :
                  if (match$6.values) {
                    return ;
                  } else {
                    return {
                            zipper: {
                              focus: /* Value */Block.__(2, [/* VNum */Block.__(0, [match$8[0]])]),
                              ctxts: match.ctxts
                            },
                            env: c.env,
                            stack: c.stack
                          };
                  }
              case /* Bracket */3 :
                  if (match$6.values) {
                    return ;
                  } else {
                    var env$2 = c.env;
                    return {
                            zipper: {
                              focus: /* ZExp */Block.__(0, [match$8[0]]),
                              ctxts: /* [] */0
                            },
                            env: env$2,
                            stack: /* :: */[
                              {
                                ctxts: match.ctxts,
                                env: env$2
                              },
                              c.stack
                            ]
                          };
                  }
              
            }
          }
        } else {
          var match$17 = match$7[0];
          if (match$17.tag) {
            var match$18 = match$6.values;
            if (match$18 && !match$18[1]) {
              return {
                      zipper: {
                        focus: /* ZExp */Block.__(0, [match$17[1]]),
                        ctxts: match.ctxts
                      },
                      env: /* :: */[
                        {
                          vid: match$17[0],
                          value: match$18[0]
                        },
                        c.env
                      ],
                      stack: c.stack
                    };
            } else {
              return ;
            }
          } else if (match$6.values) {
            return ;
          } else {
            return {
                    zipper: {
                      focus: /* ZExp */Block.__(0, [match$17[0]]),
                      ctxts: match.ctxts
                    },
                    env: c.env,
                    stack: c.stack
                  };
          }
        }
    case /* Value */2 :
        var match$19 = match.ctxts;
        var v = match$1[0];
        if (match$19) {
          var match$20 = match$19[0];
          var match$21 = match$20.args;
          var op$1 = match$20.op;
          if (match$21) {
            return {
                    zipper: {
                      focus: /* ZExp */Block.__(0, [match$21[0]]),
                      ctxts: /* :: */[
                        {
                          op: op$1,
                          args: match$21[1],
                          values: /* :: */[
                            v,
                            match$20.values
                          ]
                        },
                        match$19[1]
                      ]
                    },
                    env: c.env,
                    stack: c.stack
                  };
          } else {
            return {
                    zipper: {
                      focus: /* ZPreVal */Block.__(1, [{
                            op: op$1,
                            values: List.rev(match$20.values)
                          }]),
                      ctxts: match$19[1]
                    },
                    env: c.env,
                    stack: c.stack
                  };
          }
        } else {
          var match$22 = c.stack;
          if (match$22) {
            var match$23 = match$22[0];
            return {
                    zipper: {
                      focus: /* Value */Block.__(2, [v]),
                      ctxts: match$23.ctxts
                    },
                    env: match$23.env,
                    stack: match$22[1]
                  };
          } else {
            return ;
          }
        }
    
  }
}

function vidFromFFS5(vid) {
  return vid;
}

function intFromFFS5($$int) {
  return $$int;
}

function lambdaFromFFS5(param) {
  return {
          vid: param.vid,
          exp: expFromFFS5(param.exp)
        };
}

function aexpFromFFS5(aexp) {
  switch (aexp.tag | 0) {
    case /* Var */0 :
        return {
                op: /* AExp */Block.__(1, [/* Var */Block.__(0, [aexp[0]])]),
                args: /* [] */0
              };
    case /* App */1 :
        return {
                op: /* AExp */Block.__(1, [/* App */0]),
                args: List.map(aexpFromFFS5, /* :: */[
                      aexp[0],
                      /* :: */[
                        aexp[1],
                        /* [] */0
                      ]
                    ])
              };
    case /* Lam */2 :
        return {
                op: /* AExp */Block.__(1, [/* Lam */Block.__(1, [lambdaFromFFS5(aexp[0])])]),
                args: /* [] */0
              };
    case /* Num */3 :
        return {
                op: /* AExp */Block.__(1, [/* Num */Block.__(2, [aexp[0]])]),
                args: /* [] */0
              };
    case /* Add */4 :
        return {
                op: /* AExp */Block.__(1, [/* Add */1]),
                args: List.map(aexpFromFFS5, /* :: */[
                      aexp[0],
                      /* :: */[
                        aexp[1],
                        /* [] */0
                      ]
                    ])
              };
    case /* Bracket */5 :
        return {
                op: /* AExp */Block.__(1, [/* Bracket */Block.__(3, [expFromFFS5(aexp[0])])]),
                args: /* [] */0
              };
    
  }
}

function expFromFFS5(exp) {
  if (exp.tag) {
    return {
            op: /* Exp */Block.__(0, [/* Let */Block.__(1, [
                    exp[0],
                    expFromFFS5(exp[2])
                  ])]),
            args: List.map(aexpFromFFS5, /* :: */[
                  exp[1],
                  /* [] */0
                ])
          };
  } else {
    return {
            op: /* Exp */Block.__(0, [/* Lift */Block.__(0, [aexpFromFFS5(exp[0])])]),
            args: /* [] */0
          };
  }
}

function inject(e) {
  return {
          zipper: {
            focus: /* ZExp */Block.__(0, [e]),
            ctxts: /* [] */0
          },
          env: /* [] */0,
          stack: /* [] */0
        };
}

function isFinal(c) {
  var match = c.zipper;
  switch (match.focus.tag | 0) {
    case /* ZExp */0 :
    case /* ZPreVal */1 :
        return false;
    case /* Value */2 :
        if (match.ctxts || c.stack) {
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

function interpretTrace(p) {
  var x = inject(p);
  var states = iterateMaybeAux(step, Caml_option.some(x));
  return takeWhileInclusive((function (c) {
                return !isFinal(c);
              }), states);
}

var advance = step;

exports.lookup = lookup;
exports.step = step;
exports.vidFromFFS5 = vidFromFFS5;
exports.intFromFFS5 = intFromFFS5;
exports.lambdaFromFFS5 = lambdaFromFFS5;
exports.aexpFromFFS5 = aexpFromFFS5;
exports.expFromFFS5 = expFromFFS5;
exports.inject = inject;
exports.isFinal = isFinal;
exports.iterateMaybeAux = iterateMaybeAux;
exports.advance = advance;
exports.takeWhileInclusive = takeWhileInclusive;
exports.iterateMaybe = iterateMaybe;
exports.interpretTrace = interpretTrace;
/* No side effect */
