'use strict';

var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");

function lookup(x, _env) {
  while(true) {
    var env = _env;
    if (env) {
      var match = env[0];
      if (x === match.id) {
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

function step(param) {
  var stack = param.stack;
  var frame = param.frame;
  var env = frame.env;
  var ctxts = frame.ctxts;
  var focus = param.focus;
  switch (focus.tag | 0) {
    case /* Var */0 :
        var match = lookup(focus[0], env);
        if (match !== undefined) {
          return /* tuple */[
                  {
                    focus: /* Val */Block.__(3, [match]),
                    frame: frame,
                    stack: stack
                  },
                  /* tuple */[
                    "lookup x in env",
                    /* LOOKUP */0
                  ]
                ];
        } else {
          return ;
        }
    case /* App */1 :
        var f = focus[0];
        if (f.tag === /* Val */3) {
          var match$1 = focus[1];
          if (match$1.tag === /* Val */3) {
            var match$2 = f[0];
            var match$3 = match$2[0];
            return /* tuple */[
                    {
                      focus: match$3.expr,
                      frame: {
                        ctxts: ctxts,
                        env: /* :: */[
                          {
                            id: match$3.id,
                            value: match$1[0]
                          },
                          match$2[1]
                        ]
                      },
                      stack: /* :: */[
                        frame,
                        stack
                      ]
                    },
                    /* tuple */[
                      "copy `frame` to `stack`. move `x` to `env`. move `v` to `env`. move `e'` to focus",
                      /* PUSHENTER */2
                    ]
                  ];
          }
          
        }
        return /* tuple */[
                {
                  focus: f,
                  frame: {
                    ctxts: /* :: */[
                      /* AppL */Block.__(0, [
                          /* () */0,
                          focus[1]
                        ]),
                      ctxts
                    ],
                    env: env
                  },
                  stack: stack
                },
                /* tuple */[
                  "move f to focus. mutate App to AppL. move x to AppL?",
                  /* EVALF */3
                ]
              ];
    case /* Lam */2 :
        return /* tuple */[
                {
                  focus: /* Val */Block.__(3, [/* Clo */[
                        focus[0],
                        env
                      ]]),
                  frame: frame,
                  stack: stack
                },
                /* tuple */[
                  "copy `env` and move `lam` to make `clo`",
                  /* LAM2CLO */1
                ]
              ];
    case /* Val */3 :
        var v = focus[0];
        if (ctxts) {
          var match$4 = ctxts[0];
          if (match$4.tag) {
            return /* tuple */[
                    {
                      focus: /* App */Block.__(1, [
                          /* Val */Block.__(3, [match$4[0]]),
                          /* Val */Block.__(3, [v])
                        ]),
                      frame: {
                        ctxts: ctxts[1],
                        env: env
                      },
                      stack: stack
                    },
                    /* tuple */[
                      "mutate AppR to App. move v_f into Val. move v into Val",
                      /* PREPE */5
                    ]
                  ];
          } else {
            return /* tuple */[
                    {
                      focus: match$4[1],
                      frame: {
                        ctxts: /* :: */[
                          /* AppR */Block.__(1, [
                              v,
                              /* () */0
                            ]),
                          ctxts[1]
                        ],
                        env: env
                      },
                      stack: stack
                    },
                    /* tuple */[
                      "mutate AppL to AppR. move x to focus. move v to AppR.",
                      /* EVALX */4
                    ]
                  ];
          }
        } else if (stack) {
          return /* tuple */[
                  {
                    focus: focus,
                    frame: stack[0],
                    stack: stack[1]
                  },
                  /* tuple */[
                    "move frame to frame",
                    /* POP */6
                  ]
                ];
        } else {
          return ;
        }
    
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

function inject(p) {
  return {
          focus: p,
          frame: {
            ctxts: /* [] */0,
            env: /* [] */0
          },
          stack: /* [] */0
        };
}

function isFinal(ms) {
  return false;
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

function advance(ms) {
  var match = step(ms);
  if (match !== undefined) {
    return match[0];
  }
  
}

function iterateMaybe(f, x) {
  return iterateMaybeAux(f, Caml_option.some(x));
}

function interpretTrace(p) {
  var x = inject(p);
  return takeWhileInclusive((function (c) {
                return true;
              }), iterateMaybeAux(advance, Caml_option.some(x)));
}

var empty = {
  focus: /* Var */Block.__(0, ["x"]),
  frame: {
    ctxts: /* [] */0,
    env: /* [] */0
  },
  stack: /* [] */0
};

exports.lookup = lookup;
exports.step = step;
exports.takeWhileInclusive = takeWhileInclusive;
exports.empty = empty;
exports.inject = inject;
exports.isFinal = isFinal;
exports.iterateMaybeAux = iterateMaybeAux;
exports.advance = advance;
exports.iterateMaybe = iterateMaybe;
exports.interpretTrace = interpretTrace;
/* No side effect */
