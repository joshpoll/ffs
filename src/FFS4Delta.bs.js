'use strict';

var List = require("bs-platform/lib/js/list.js");
var $$Array = require("bs-platform/lib/js/array.js");
var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
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
  var match = c.focus;
  switch (match.tag | 0) {
    case /* AExp */0 :
        var match$1 = match[0];
        switch (match$1.tag | 0) {
          case /* Var */0 :
              var match$2 = c.frame;
              var env = match$2.env;
              var match$3 = lookup(match$1[0], env);
              if (match$3 !== undefined) {
                return /* tuple */[
                        {
                          focus: /* Value */Block.__(2, [match$3]),
                          frame: {
                            ctxts: match$2.ctxts,
                            env: env
                          },
                          stack: c.stack
                        },
                        "var"
                      ];
              } else {
                return ;
              }
          case /* App */1 :
              var match$4 = c.frame;
              return /* tuple */[
                      {
                        focus: /* AExp */Block.__(0, [match$1[0]]),
                        frame: {
                          ctxts: /* :: */[
                            /* AppL */Block.__(0, [
                                /* () */0,
                                match$1[1]
                              ]),
                            match$4.ctxts
                          ],
                          env: match$4.env
                        },
                        stack: c.stack
                      },
                      "app_begin"
                    ];
          case /* Lam */2 :
              var match$5 = c.frame;
              var env$1 = match$5.env;
              return /* tuple */[
                      {
                        focus: /* Value */Block.__(2, [/* Clo */Block.__(1, [
                                match$1[0],
                                env$1
                              ])]),
                        frame: {
                          ctxts: match$5.ctxts,
                          env: env$1
                        },
                        stack: c.stack
                      },
                      "lam"
                    ];
          case /* Num */3 :
              return /* tuple */[
                      {
                        focus: /* Value */Block.__(2, [/* VNum */Block.__(0, [match$1[0]])]),
                        frame: c.frame,
                        stack: c.stack
                      },
                      "num"
                    ];
          case /* Add */4 :
              var match$6 = c.frame;
              return /* tuple */[
                      {
                        focus: /* AExp */Block.__(0, [match$1[0]]),
                        frame: {
                          ctxts: /* :: */[
                            /* AddL */Block.__(3, [
                                /* () */0,
                                match$1[1]
                              ]),
                            match$6.ctxts
                          ],
                          env: match$6.env
                        },
                        stack: c.stack
                      },
                      "add_begin"
                    ];
          case /* Bracket */5 :
              var match$7 = c.frame;
              var env$2 = match$7.env;
              return /* tuple */[
                      {
                        focus: /* Exp */Block.__(1, [match$1[0]]),
                        frame: {
                          ctxts: /* [] */0,
                          env: env$2
                        },
                        stack: /* :: */[
                          {
                            ctxts: match$7.ctxts,
                            env: env$2
                          },
                          c.stack
                        ]
                      },
                      "bracket"
                    ];
          
        }
    case /* Exp */1 :
        var match$8 = match[0];
        if (match$8.tag) {
          var match$9 = c.frame;
          return /* tuple */[
                  {
                    focus: /* AExp */Block.__(0, [match$8[1]]),
                    frame: {
                      ctxts: /* :: */[
                        /* LetL */Block.__(2, [
                            match$8[0],
                            /* () */0,
                            match$8[2]
                          ]),
                        match$9.ctxts
                      ],
                      env: match$9.env
                    },
                    stack: c.stack
                  },
                  "let_begin"
                ];
        } else {
          return /* tuple */[
                  {
                    focus: /* AExp */Block.__(0, [match$8[0]]),
                    frame: c.frame,
                    stack: c.stack
                  },
                  "lift"
                ];
        }
    case /* Value */2 :
        var v = match[0];
        var match$10 = c.frame;
        var match$11 = match$10.ctxts;
        if (match$11) {
          var match$12 = match$11[0];
          switch (match$12.tag | 0) {
            case /* AppL */0 :
                return /* tuple */[
                        {
                          focus: /* AExp */Block.__(0, [match$12[1]]),
                          frame: {
                            ctxts: /* :: */[
                              /* AppR */Block.__(1, [
                                  v,
                                  /* () */0
                                ]),
                              match$11[1]
                            ],
                            env: match$10.env
                          },
                          stack: c.stack
                        },
                        "app_l"
                      ];
            case /* AppR */1 :
                var match$13 = match$12[0];
                if (match$13.tag) {
                  var match$14 = match$13[0];
                  return /* tuple */[
                          {
                            focus: /* Exp */Block.__(1, [match$14.exp]),
                            frame: {
                              ctxts: /* [] */0,
                              env: /* :: */[
                                {
                                  vid: match$14.vid,
                                  value: v
                                },
                                match$13[1]
                              ]
                            },
                            stack: /* :: */[
                              {
                                ctxts: match$11[1],
                                env: match$10.env
                              },
                              c.stack
                            ]
                          },
                          "app_r"
                        ];
                } else {
                  return ;
                }
            case /* LetL */2 :
                return /* tuple */[
                        {
                          focus: /* Exp */Block.__(1, [match$12[2]]),
                          frame: {
                            ctxts: match$11[1],
                            env: /* :: */[
                              {
                                vid: match$12[0],
                                value: v
                              },
                              match$10.env
                            ]
                          },
                          stack: c.stack
                        },
                        "let_l"
                      ];
            case /* AddL */3 :
                return /* tuple */[
                        {
                          focus: /* AExp */Block.__(0, [match$12[1]]),
                          frame: {
                            ctxts: /* :: */[
                              /* AddR */Block.__(4, [
                                  v,
                                  /* () */0
                                ]),
                              match$11[1]
                            ],
                            env: match$10.env
                          },
                          stack: c.stack
                        },
                        "add_l"
                      ];
            case /* AddR */4 :
                if (v.tag) {
                  return ;
                } else {
                  var match$15 = c.frame;
                  var match$16 = match$15.ctxts;
                  var match$17 = match$16[0][0];
                  if (match$17.tag) {
                    return ;
                  } else {
                    return /* tuple */[
                            {
                              focus: /* Value */Block.__(2, [/* VNum */Block.__(0, [match$17[0] + v[0] | 0])]),
                              frame: {
                                ctxts: match$16[1],
                                env: match$15.env
                              },
                              stack: c.stack
                            },
                            "add_r"
                          ];
                  }
                }
            
          }
        } else {
          var match$18 = c.stack;
          if (match$18) {
            return /* tuple */[
                    {
                      focus: /* Value */Block.__(2, [v]),
                      frame: match$18[0],
                      stack: match$18[1]
                    },
                    "app_exit"
                  ];
          } else {
            return ;
          }
        }
    
  }
}

function inject(e) {
  return {
          focus: /* Exp */Block.__(1, [e]),
          frame: {
            ctxts: /* [] */0,
            env: /* [] */0
          },
          stack: /* [] */0
        };
}

function isFinal(c) {
  switch (c.focus.tag | 0) {
    case /* AExp */0 :
    case /* Exp */1 :
        return false;
    case /* Value */2 :
        if (c.frame.ctxts || c.stack) {
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
  console.log("rules", $$Array.of_list(match[1]));
  return takeWhileInclusive((function (c) {
                return !isFinal(c);
              }), match[0]);
}

function interpret(p) {
  var s = List.hd(List.rev(interpretTrace(p)));
  var match = s.focus;
  switch (match.tag | 0) {
    case /* AExp */0 :
    case /* Exp */1 :
        throw Pervasives.failwith("expected a value");
    case /* Value */2 :
        return match[0];
    
  }
}

var loading_focus = /* Exp */Block.__(1, [/* Lift */Block.__(0, [/* Var */Block.__(0, ["loading..."])])]);

var loading_frame = {
  ctxts: /* [] */0,
  env: /* [] */0
};

var loading = {
  focus: loading_focus,
  frame: loading_frame,
  stack: /* [] */0
};

var advance = step;

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
exports.loading = loading;
/* No side effect */
