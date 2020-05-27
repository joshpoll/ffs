'use strict';

var List = require("bs-platform/lib/js/list.js");
var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");

function lookup(x, _env) {
  while(true) {
    var env = _env;
    if (!env) {
      return ;
    }
    var match = env[0];
    if (x === match.vid) {
      return match.value;
    }
    _env = env[1];
    continue ;
  };
}

function step(c) {
  var match = c.zipper;
  var v = match.focus;
  switch (v.tag | 0) {
    case /* ZExp */0 :
        var match$1 = v[0];
        var op = match$1.op;
        if (op.tag) {
          var x = op[0];
          if (typeof x !== "number") {
            switch (x.tag | 0) {
              case /* Var */0 :
                  if (!match$1.args) {
                    var env = c.env;
                    var v$1 = lookup(x[0], env);
                    if (v$1 !== undefined) {
                      return {
                              zipper: {
                                focus: /* Value */Block.__(2, [v$1]),
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
                  if (!match$1.args) {
                    var env$1 = c.env;
                    return {
                            zipper: {
                              focus: /* Value */Block.__(2, [/* Clo */Block.__(1, [
                                      x[0],
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
        var match$2 = match$1.args;
        if (match$2) {
          return {
                  zipper: {
                    focus: /* ZExp */Block.__(0, [match$2[0]]),
                    ctxts: /* :: */[
                      {
                        op: op,
                        args: match$2[1],
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
        var match$3 = v[0];
        var match$4 = match$3.op;
        if (match$4.tag) {
          var n = match$4[0];
          if (typeof n === "number") {
            if (n === /* App */0) {
              var match$5 = match$3.values;
              if (!match$5) {
                return ;
              }
              var match$6 = match$5[0];
              if (!match$6.tag) {
                return ;
              }
              var match$7 = match$5[1];
              if (!match$7) {
                return ;
              }
              if (match$7[1]) {
                return ;
              }
              var match$8 = match$6[0];
              return {
                      zipper: {
                        focus: /* ZExp */Block.__(0, [match$8.exp]),
                        ctxts: /* [] */0
                      },
                      env: /* :: */[
                        {
                          vid: match$8.vid,
                          value: match$7[0]
                        },
                        match$6[1]
                      ],
                      stack: /* :: */[
                        {
                          ctxts: match.ctxts,
                          env: c.env
                        },
                        c.stack
                      ]
                    };
            }
            var match$9 = match$3.values;
            if (!match$9) {
              return ;
            }
            var v1 = match$9[0];
            if (v1.tag) {
              return ;
            }
            var match$10 = match$9[1];
            if (!match$10) {
              return ;
            }
            var v2 = match$10[0];
            if (v2.tag) {
              return ;
            }
            if (match$10[1]) {
              return ;
            }
            var v3 = v1[0] + v2[0] | 0;
            return {
                    zipper: {
                      focus: /* Value */Block.__(2, [/* VNum */Block.__(0, [v3])]),
                      ctxts: match.ctxts
                    },
                    env: c.env,
                    stack: c.stack
                  };
          } else {
            switch (n.tag | 0) {
              case /* Var */0 :
              case /* Lam */1 :
                  return ;
              case /* Num */2 :
                  if (match$3.values) {
                    return ;
                  } else {
                    return {
                            zipper: {
                              focus: /* Value */Block.__(2, [/* VNum */Block.__(0, [n[0]])]),
                              ctxts: match.ctxts
                            },
                            env: c.env,
                            stack: c.stack
                          };
                  }
              case /* Bracket */3 :
                  if (match$3.values) {
                    return ;
                  }
                  var env$2 = c.env;
                  return {
                          zipper: {
                            focus: /* ZExp */Block.__(0, [n[0]]),
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
        } else {
          var ae = match$4[0];
          if (!ae.tag) {
            if (match$3.values) {
              return ;
            } else {
              return {
                      zipper: {
                        focus: /* ZExp */Block.__(0, [ae[0]]),
                        ctxts: match.ctxts
                      },
                      env: c.env,
                      stack: c.stack
                    };
            }
          }
          var match$11 = match$3.values;
          if (match$11 && !match$11[1]) {
            return {
                    zipper: {
                      focus: /* ZExp */Block.__(0, [ae[1]]),
                      ctxts: match.ctxts
                    },
                    env: /* :: */[
                      {
                        vid: ae[0],
                        value: match$11[0]
                      },
                      c.env
                    ],
                    stack: c.stack
                  };
          } else {
            return ;
          }
        }
    case /* Value */2 :
        var match$12 = match.ctxts;
        var v$2 = v[0];
        if (match$12) {
          var match$13 = match$12[0];
          var match$14 = match$13.args;
          var op$1 = match$13.op;
          if (match$14) {
            return {
                    zipper: {
                      focus: /* ZExp */Block.__(0, [match$14[0]]),
                      ctxts: /* :: */[
                        {
                          op: op$1,
                          args: match$14[1],
                          values: /* :: */[
                            v$2,
                            match$13.values
                          ]
                        },
                        match$12[1]
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
                            values: List.rev(/* :: */[
                                  v$2,
                                  match$13.values
                                ])
                          }]),
                      ctxts: match$12[1]
                    },
                    env: c.env,
                    stack: c.stack
                  };
          }
        }
        var match$15 = c.stack;
        if (!match$15) {
          return ;
        }
        var match$16 = match$15[0];
        return {
                zipper: {
                  focus: /* Value */Block.__(2, [v$2]),
                  ctxts: match$16.ctxts
                },
                env: match$16.env,
                stack: match$15[1]
              };
    
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
