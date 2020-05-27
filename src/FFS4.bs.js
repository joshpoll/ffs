'use strict';

var List = require("bs-platform/lib/js/list.js");
var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
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
  var v = c.focus;
  switch (v.tag | 0) {
    case /* AExp */0 :
        var x = v[0];
        switch (x.tag | 0) {
          case /* Var */0 :
              var match = c.frame;
              var env = match.env;
              var v$1 = lookup(x[0], env);
              if (v$1 !== undefined) {
                return {
                        focus: /* Value */Block.__(2, [v$1]),
                        frame: {
                          ctxts: match.ctxts,
                          env: env
                        },
                        stack: c.stack
                      };
              } else {
                return ;
              }
          case /* App */1 :
              var match$1 = c.frame;
              return {
                      focus: /* AExp */Block.__(0, [x[0]]),
                      frame: {
                        ctxts: /* :: */[
                          /* AppL */Block.__(0, [
                              undefined,
                              x[1]
                            ]),
                          match$1.ctxts
                        ],
                        env: match$1.env
                      },
                      stack: c.stack
                    };
          case /* Lam */2 :
              var match$2 = c.frame;
              var env$1 = match$2.env;
              return {
                      focus: /* Value */Block.__(2, [/* Clo */Block.__(1, [
                              x[0],
                              env$1
                            ])]),
                      frame: {
                        ctxts: match$2.ctxts,
                        env: env$1
                      },
                      stack: c.stack
                    };
          case /* Num */3 :
              return {
                      focus: /* Value */Block.__(2, [/* VNum */Block.__(0, [x[0]])]),
                      frame: c.frame,
                      stack: c.stack
                    };
          case /* Add */4 :
              var match$3 = c.frame;
              return {
                      focus: /* AExp */Block.__(0, [x[0]]),
                      frame: {
                        ctxts: /* :: */[
                          /* AddL */Block.__(3, [
                              undefined,
                              x[1]
                            ]),
                          match$3.ctxts
                        ],
                        env: match$3.env
                      },
                      stack: c.stack
                    };
          case /* Bracket */5 :
              var match$4 = c.frame;
              var env$2 = match$4.env;
              return {
                      focus: /* Exp */Block.__(1, [x[0]]),
                      frame: {
                        ctxts: /* [] */0,
                        env: env$2
                      },
                      stack: /* :: */[
                        {
                          ctxts: match$4.ctxts,
                          env: env$2
                        },
                        c.stack
                      ]
                    };
          
        }
    case /* Exp */1 :
        var a = v[0];
        if (!a.tag) {
          return {
                  focus: /* AExp */Block.__(0, [a[0]]),
                  frame: c.frame,
                  stack: c.stack
                };
        }
        var match$5 = c.frame;
        return {
                focus: /* AExp */Block.__(0, [a[1]]),
                frame: {
                  ctxts: /* :: */[
                    /* LetL */Block.__(2, [
                        a[0],
                        undefined,
                        a[2]
                      ]),
                    match$5.ctxts
                  ],
                  env: match$5.env
                },
                stack: c.stack
              };
    case /* Value */2 :
        var v$2 = v[0];
        var match$6 = c.frame;
        var match$7 = match$6.ctxts;
        if (match$7) {
          var match$8 = match$7[0];
          switch (match$8.tag | 0) {
            case /* AppL */0 :
                return {
                        focus: /* AExp */Block.__(0, [match$8[1]]),
                        frame: {
                          ctxts: /* :: */[
                            /* AppR */Block.__(1, [
                                v$2,
                                undefined
                              ]),
                            match$7[1]
                          ],
                          env: match$6.env
                        },
                        stack: c.stack
                      };
            case /* AppR */1 :
                var match$9 = match$8[0];
                if (!match$9.tag) {
                  return ;
                }
                var match$10 = match$9[0];
                return {
                        focus: /* Exp */Block.__(1, [match$10.exp]),
                        frame: {
                          ctxts: /* [] */0,
                          env: /* :: */[
                            {
                              vid: match$10.vid,
                              value: v$2
                            },
                            match$9[1]
                          ]
                        },
                        stack: /* :: */[
                          {
                            ctxts: match$7[1],
                            env: match$6.env
                          },
                          c.stack
                        ]
                      };
            case /* LetL */2 :
                return {
                        focus: /* Exp */Block.__(1, [match$8[2]]),
                        frame: {
                          ctxts: match$7[1],
                          env: /* :: */[
                            {
                              vid: match$8[0],
                              value: v$2
                            },
                            match$6.env
                          ]
                        },
                        stack: c.stack
                      };
            case /* AddL */3 :
                return {
                        focus: /* AExp */Block.__(0, [match$8[1]]),
                        frame: {
                          ctxts: /* :: */[
                            /* AddR */Block.__(4, [
                                v$2,
                                undefined
                              ]),
                            match$7[1]
                          ],
                          env: match$6.env
                        },
                        stack: c.stack
                      };
            case /* AddR */4 :
                if (v$2.tag) {
                  return ;
                }
                var match$11 = c.frame;
                var match$12 = match$11.ctxts;
                var x$1 = match$12[0][0];
                if (x$1.tag) {
                  return ;
                } else {
                  return {
                          focus: /* Value */Block.__(2, [/* VNum */Block.__(0, [x$1[0] + v$2[0] | 0])]),
                          frame: {
                            ctxts: match$12[1],
                            env: match$11.env
                          },
                          stack: c.stack
                        };
                }
            
          }
        } else {
          var match$13 = c.stack;
          if (match$13) {
            return {
                    focus: /* Value */Block.__(2, [v$2]),
                    frame: match$13[0],
                    stack: match$13[1]
                  };
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
  return takeWhileInclusive((function (c) {
                return !isFinal(c);
              }), iterateMaybeAux(step, Caml_option.some(x)));
}

function interpret(p) {
  var s = List.hd(List.rev(interpretTrace(p)));
  var v = s.focus;
  switch (v.tag | 0) {
    case /* AExp */0 :
    case /* Exp */1 :
        throw Pervasives.failwith("expected a value");
    case /* Value */2 :
        return v[0];
    
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
exports.interpretTrace = interpretTrace;
exports.interpret = interpret;
exports.loading = loading;
/* No side effect */
