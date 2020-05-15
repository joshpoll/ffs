'use strict';

var List = require("bs-platform/lib/js/list.js");
var $$Array = require("bs-platform/lib/js/array.js");
var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var Belt_MapString = require("bs-platform/lib/js/belt_MapString.js");

var counter = {
  contents: 0
};

function readAndUpdateCounter(param) {
  counter.contents = counter.contents + 1 | 0;
  return counter.contents - 1 | 0;
}

function rauc(param) {
  return String(readAndUpdateCounter(/* () */0));
}

function vid(x) {
  return /* tuple */[
          "vid_" + String(readAndUpdateCounter(/* () */0)),
          x
        ];
}

function int_uid(n) {
  return /* tuple */[
          "int_" + String(readAndUpdateCounter(/* () */0)),
          n
        ];
}

function lambda(vid, exp_uid) {
  return {
          uid: "lambda_" + String(readAndUpdateCounter(/* () */0)),
          vid: vid,
          exp_uid: exp_uid
        };
}

function aexp_uid(ae) {
  return /* tuple */[
          "aexp_" + String(readAndUpdateCounter(/* () */0)),
          ae
        ];
}

function exp_uid(e) {
  return /* tuple */[
          "exp_" + String(readAndUpdateCounter(/* () */0)),
          e
        ];
}

function value_uid(v) {
  return /* tuple */[
          "value_" + String(readAndUpdateCounter(/* () */0)),
          v
        ];
}

function binding(vid, value_uid) {
  return {
          uid: "binding_" + String(readAndUpdateCounter(/* () */0)),
          vid: vid,
          value_uid: value_uid
        };
}

function env_uid(bs) {
  return /* tuple */[
          "env_" + String(readAndUpdateCounter(/* () */0)),
          bs
        ];
}

function ctxt_uid(c) {
  return /* tuple */[
          "ctxt_" + String(readAndUpdateCounter(/* () */0)),
          c
        ];
}

function focus_uid(f) {
  return /* tuple */[
          "focus_" + String(readAndUpdateCounter(/* () */0)),
          f
        ];
}

function ctxts_uid(cs) {
  return /* tuple */[
          "ctxts_" + String(readAndUpdateCounter(/* () */0)),
          cs
        ];
}

function zipper(focus_uid, ctxts_uid) {
  return {
          uid: "zipper_" + String(readAndUpdateCounter(/* () */0)),
          focus_uid: focus_uid,
          ctxts_uid: ctxts_uid
        };
}

function frame(ctxts_uid, env_uid) {
  return {
          uid: "frame_" + String(readAndUpdateCounter(/* () */0)),
          ctxts_uid: ctxts_uid,
          env_uid: env_uid
        };
}

function stack_uid(fs) {
  return /* tuple */[
          "stack_" + String(readAndUpdateCounter(/* () */0)),
          fs
        ];
}

function config(zipper, env_uid, stack_uid) {
  return {
          uid: "config_" + String(readAndUpdateCounter(/* () */0)),
          zipper: zipper,
          env_uid: env_uid,
          stack_uid: stack_uid
        };
}

function lookup(x, _env) {
  while(true) {
    var env = _env;
    var env_val = env[1];
    if (env_val) {
      var match = env_val[0];
      var match$1 = match.value_uid;
      var v_uid = match$1[0];
      if (x[1] === match.vid[1]) {
        var fresh = "valLookup_" + String(readAndUpdateCounter(/* () */0));
        return /* tuple */[
                /* tuple */[
                  fresh,
                  match$1[1]
                ],
                Belt_MapString.fromArray([/* tuple */[
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

function flowMerge(m1, m2) {
  return Belt_MapString.merge(m1, m2, (function (param, mv1, mv2) {
                if (mv1 !== undefined) {
                  var v1 = mv1;
                  if (mv2 !== undefined) {
                    return Pervasives.$at(v1, mv2);
                  } else {
                    return v1;
                  }
                } else if (mv2 !== undefined) {
                  return mv2;
                } else {
                  return ;
                }
              }));
}

function step(c) {
  var match = c.zipper;
  var match$1 = match.focus_uid[1];
  switch (match$1.tag | 0) {
    case /* AExp */0 :
        var match$2 = match$1[0][1];
        switch (match$2.tag | 0) {
          case /* Var */0 :
              var match$3 = c.stack_uid;
              var stack_uid$1 = match$3[0];
              var match$4 = c.env_uid;
              var env_val = match$4[1];
              var env_uid$1 = match$4[0];
              var match$5 = match.ctxts_uid;
              var ctxts_uid$1 = match$5[0];
              var match$6 = lookup(match$2[0], /* tuple */[
                    env_uid$1,
                    env_val
                  ]);
              if (match$6 !== undefined) {
                var match$7 = match$6;
                var match$8 = match$7[0];
                return /* tuple */[
                        config(zipper(focus_uid(/* Value */Block.__(2, [/* tuple */[
                                          match$8[0],
                                          match$8[1]
                                        ]])), /* tuple */[
                                  ctxts_uid$1,
                                  match$5[1]
                                ]), /* tuple */[
                              env_uid$1,
                              env_val
                            ], /* tuple */[
                              stack_uid$1,
                              match$3[1]
                            ]),
                        /* tuple */[
                          "var",
                          flowMerge(Belt_MapString.fromArray([
                                    /* tuple */[
                                      ctxts_uid$1,
                                      /* :: */[
                                        ctxts_uid$1,
                                        /* [] */0
                                      ]
                                    ],
                                    /* tuple */[
                                      env_uid$1,
                                      /* :: */[
                                        env_uid$1,
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
                                  ]), match$7[1])
                        ]
                      ];
              } else {
                return ;
              }
          case /* App */1 :
              var s = c.stack_uid;
              var s_uid = s[0];
              var env = c.env_uid;
              var env_uid$2 = env[0];
              var c$1 = match.ctxts_uid;
              var c_uid = c$1[0];
              var x = match$2[1];
              var x_uid = x[0];
              var f = match$2[0];
              var f_uid = f[0];
              return /* tuple */[
                      config(zipper(focus_uid(/* AExp */Block.__(0, [f])), ctxts_uid(/* Ctxt */[
                                    /* tuple */[
                                      String(readAndUpdateCounter(/* () */0)),
                                      /* AppL */Block.__(0, [
                                          /* () */0,
                                          x
                                        ])
                                    ],
                                    c$1
                                  ])), env, s),
                      /* tuple */[
                        "app_begin",
                        Belt_MapString.fromArray([
                              /* tuple */[
                                f_uid,
                                /* :: */[
                                  f_uid,
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
                                c_uid,
                                /* :: */[
                                  c_uid,
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
                                s_uid,
                                /* :: */[
                                  s_uid,
                                  /* [] */0
                                ]
                              ]
                            ])
                      ]
                    ];
          case /* Lam */2 :
              var match$9 = c.stack_uid;
              var stack_uid$2 = match$9[0];
              var match$10 = c.env_uid;
              var env_val$1 = match$10[1];
              var env_uid$3 = match$10[0];
              var match$11 = match.ctxts_uid;
              var ctxts_uid$2 = match$11[0];
              var l = match$2[0];
              var l_uid = l.uid;
              var env_uid2 = "envCopy_" + String(readAndUpdateCounter(/* () */0));
              return /* tuple */[
                      config(zipper(/* tuple */[
                                String(readAndUpdateCounter(/* () */0)),
                                /* Value */Block.__(2, [/* tuple */[
                                      String(readAndUpdateCounter(/* () */0)),
                                      /* Clo */Block.__(1, [
                                          l,
                                          /* tuple */[
                                            env_uid2,
                                            env_val$1
                                          ]
                                        ])
                                    ]])
                              ], /* tuple */[
                                ctxts_uid$2,
                                match$11[1]
                              ]), /* tuple */[
                            env_uid$3,
                            env_val$1
                          ], /* tuple */[
                            stack_uid$2,
                            match$9[1]
                          ]),
                      /* tuple */[
                        "lam",
                        Belt_MapString.fromArray([
                              /* tuple */[
                                l_uid,
                                /* :: */[
                                  l_uid,
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
                                env_uid$3,
                                /* :: */[
                                  env_uid$3,
                                  /* :: */[
                                    env_uid2,
                                    /* [] */0
                                  ]
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
          case /* Num */3 :
              var s$1 = c.stack_uid;
              var s_uid$1 = s$1[0];
              var en = c.env_uid;
              var en_uid = en[0];
              var c$2 = match.ctxts_uid;
              var c_uid$1 = c$2[0];
              var n = match$2[0];
              var n_uid = n[0];
              return /* tuple */[
                      config(zipper(focus_uid(/* Value */Block.__(2, [value_uid(/* VNum */Block.__(0, [n]))])), c$2), en, s$1),
                      /* tuple */[
                        "num",
                        Belt_MapString.fromArray([
                              /* tuple */[
                                n_uid,
                                /* :: */[
                                  n_uid,
                                  /* [] */0
                                ]
                              ],
                              /* tuple */[
                                c_uid$1,
                                /* :: */[
                                  c_uid$1,
                                  /* [] */0
                                ]
                              ],
                              /* tuple */[
                                en_uid,
                                /* :: */[
                                  en_uid,
                                  /* [] */0
                                ]
                              ],
                              /* tuple */[
                                s_uid$1,
                                /* :: */[
                                  s_uid$1,
                                  /* [] */0
                                ]
                              ]
                            ])
                      ]
                    ];
          case /* Add */4 :
              var s$2 = c.stack_uid;
              var s_uid$2 = s$2[0];
              var en$1 = c.env_uid;
              var en_uid$1 = en$1[0];
              var c$3 = match.ctxts_uid;
              var c_uid$2 = c$3[0];
              var y = match$2[1];
              var y_uid = y[0];
              var x$1 = match$2[0];
              var x_uid$1 = x$1[0];
              return /* tuple */[
                      config(zipper(focus_uid(/* AExp */Block.__(0, [x$1])), ctxts_uid(/* Ctxt */[
                                    ctxt_uid(/* AddL */Block.__(3, [
                                            /* () */0,
                                            y
                                          ])),
                                    c$3
                                  ])), en$1, s$2),
                      /* tuple */[
                        "add_begin",
                        Belt_MapString.fromArray([
                              /* tuple */[
                                x_uid$1,
                                /* :: */[
                                  x_uid$1,
                                  /* [] */0
                                ]
                              ],
                              /* tuple */[
                                y_uid,
                                /* :: */[
                                  y_uid,
                                  /* [] */0
                                ]
                              ],
                              /* tuple */[
                                c_uid$2,
                                /* :: */[
                                  c_uid$2,
                                  /* [] */0
                                ]
                              ],
                              /* tuple */[
                                en_uid$1,
                                /* :: */[
                                  en_uid$1,
                                  /* [] */0
                                ]
                              ],
                              /* tuple */[
                                s_uid$2,
                                /* :: */[
                                  s_uid$2,
                                  /* [] */0
                                ]
                              ]
                            ])
                      ]
                    ];
          case /* Bracket */5 :
              var en$2 = c.env_uid;
              var en_uid$2 = en$2[0];
              var c$4 = match.ctxts_uid;
              var c_uid$3 = c$4[0];
              var e = match$2[0];
              var e_uid = e[0];
              var s$3 = c.stack_uid;
              var en_uid2 = "envCopy_" + String(readAndUpdateCounter(/* () */0));
              var s_uid$3 = s$3[0];
              return /* tuple */[
                      config(zipper(focus_uid(/* Exp */Block.__(1, [e])), ctxts_uid(/* Empty */0)), en$2, stack_uid(/* Stack */[
                                frame(c$4, /* tuple */[
                                      en_uid2,
                                      en$2[1]
                                    ]),
                                s$3
                              ])),
                      /* tuple */[
                        "bracket",
                        Belt_MapString.fromArray([
                              /* tuple */[
                                e_uid,
                                /* :: */[
                                  e_uid,
                                  /* [] */0
                                ]
                              ],
                              /* tuple */[
                                c_uid$3,
                                /* :: */[
                                  c_uid$3,
                                  /* [] */0
                                ]
                              ],
                              /* tuple */[
                                en_uid$2,
                                /* :: */[
                                  en_uid$2,
                                  /* :: */[
                                    en_uid2,
                                    /* [] */0
                                  ]
                                ]
                              ],
                              /* tuple */[
                                s_uid$3,
                                /* :: */[
                                  s_uid$3,
                                  /* [] */0
                                ]
                              ]
                            ])
                      ]
                    ];
          
        }
    case /* Exp */1 :
        var match$12 = match$1[0][1];
        if (match$12.tag) {
          var stack_uid$3 = c.stack_uid;
          var s_uid$4 = stack_uid$3[0];
          var env_uid$4 = c.env_uid;
          var en_uid$3 = env_uid$4[0];
          var c$5 = match.ctxts_uid;
          var c_uid$4 = c$5[0];
          var e2 = match$12[2];
          var e2_uid = e2[0];
          var ae1 = match$12[1];
          var ae1_uid = ae1[0];
          var x$2 = match$12[0];
          var x_uid$2 = x$2[0];
          return /* tuple */[
                  config(zipper(focus_uid(/* AExp */Block.__(0, [ae1])), ctxts_uid(/* Ctxt */[
                                ctxt_uid(/* LetL */Block.__(2, [
                                        x$2,
                                        /* () */0,
                                        e2
                                      ])),
                                c$5
                              ])), env_uid$4, stack_uid$3),
                  /* tuple */[
                    "let_begin",
                    Belt_MapString.fromArray([
                          /* tuple */[
                            x_uid$2,
                            /* :: */[
                              x_uid$2,
                              /* [] */0
                            ]
                          ],
                          /* tuple */[
                            ae1_uid,
                            /* :: */[
                              ae1_uid,
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
                            c_uid$4,
                            /* :: */[
                              c_uid$4,
                              /* [] */0
                            ]
                          ],
                          /* tuple */[
                            en_uid$3,
                            /* :: */[
                              en_uid$3,
                              /* [] */0
                            ]
                          ],
                          /* tuple */[
                            s_uid$4,
                            /* :: */[
                              s_uid$4,
                              /* [] */0
                            ]
                          ]
                        ])
                  ]
                ];
        } else {
          var s$4 = c.stack_uid;
          var s_uid$5 = s$4[0];
          var en$3 = c.env_uid;
          var en_uid$4 = en$3[0];
          var c$6 = match.ctxts_uid;
          var c_uid$5 = c$6[0];
          var a = match$12[0];
          var a_uid = a[0];
          return /* tuple */[
                  config(zipper(focus_uid(/* AExp */Block.__(0, [a])), c$6), en$3, s$4),
                  /* tuple */[
                    "lift",
                    Belt_MapString.fromArray([
                          /* tuple */[
                            a_uid,
                            /* :: */[
                              a_uid,
                              /* [] */0
                            ]
                          ],
                          /* tuple */[
                            c_uid$5,
                            /* :: */[
                              c_uid$5,
                              /* [] */0
                            ]
                          ],
                          /* tuple */[
                            en_uid$4,
                            /* :: */[
                              en_uid$4,
                              /* [] */0
                            ]
                          ],
                          /* tuple */[
                            s_uid$5,
                            /* :: */[
                              s_uid$5,
                              /* [] */0
                            ]
                          ]
                        ])
                  ]
                ];
        }
    case /* Value */2 :
        var v = match$1[0];
        var match$13 = v[1];
        var match$14 = match.ctxts_uid[1];
        if (match$14) {
          var match$15 = match$14[0][1];
          switch (match$15.tag | 0) {
            case /* AppL */0 :
                var s$5 = c.stack_uid;
                var s_uid$6 = s$5[0];
                var env$1 = c.env_uid;
                var env_uid$5 = env$1[0];
                var c$7 = match$14[1];
                var c_uid$6 = c$7[0];
                var x$3 = match$15[1];
                var x_uid$3 = x$3[0];
                var v_uid = v[0];
                return /* tuple */[
                        config(zipper(focus_uid(/* AExp */Block.__(0, [x$3])), ctxts_uid(/* Ctxt */[
                                      /* tuple */[
                                        String(readAndUpdateCounter(/* () */0)),
                                        /* AppR */Block.__(1, [
                                            v,
                                            /* () */0
                                          ])
                                      ],
                                      c$7
                                    ])), env$1, s$5),
                        /* tuple */[
                          "app_l",
                          Belt_MapString.fromArray([
                                /* tuple */[
                                  v_uid,
                                  /* :: */[
                                    v_uid,
                                    /* [] */0
                                  ]
                                ],
                                /* tuple */[
                                  x_uid$3,
                                  /* :: */[
                                    x_uid$3,
                                    /* [] */0
                                  ]
                                ],
                                /* tuple */[
                                  c_uid$6,
                                  /* :: */[
                                    c_uid$6,
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
                                  s_uid$6,
                                  /* :: */[
                                    s_uid$6,
                                    /* [] */0
                                  ]
                                ]
                              ])
                        ]
                      ];
            case /* AppR */1 :
                var match$16 = match$15[0][1];
                if (match$16.tag) {
                  var s$6 = c.stack_uid;
                  var s_uid$7 = s$6[0];
                  var env2 = c.env_uid;
                  var en2_uid = env2[0];
                  var c$8 = match$14[1];
                  var c_uid$7 = c$8[0];
                  var env$2 = match$16[1];
                  var en_uid$5 = env$2[0];
                  var match$17 = match$16[0];
                  var e$1 = match$17.exp_uid;
                  var e_uid$1 = e$1[0];
                  var x$4 = match$17.vid;
                  var x_uid$4 = x$4[0];
                  var v_uid$1 = v[0];
                  return /* tuple */[
                          config(zipper(focus_uid(/* Exp */Block.__(1, [e$1])), ctxts_uid(/* Empty */0)), env_uid(/* Env */[
                                    binding(x$4, v),
                                    env$2
                                  ]), stack_uid(/* Stack */[
                                    frame(c$8, env2),
                                    s$6
                                  ])),
                          /* tuple */[
                            "app_r",
                            Belt_MapString.fromArray([
                                  /* tuple */[
                                    v_uid$1,
                                    /* :: */[
                                      v_uid$1,
                                      /* [] */0
                                    ]
                                  ],
                                  /* tuple */[
                                    x_uid$4,
                                    /* :: */[
                                      x_uid$4,
                                      /* [] */0
                                    ]
                                  ],
                                  /* tuple */[
                                    e_uid$1,
                                    /* :: */[
                                      e_uid$1,
                                      /* [] */0
                                    ]
                                  ],
                                  /* tuple */[
                                    en_uid$5,
                                    /* :: */[
                                      en_uid$5,
                                      /* [] */0
                                    ]
                                  ],
                                  /* tuple */[
                                    c_uid$7,
                                    /* :: */[
                                      c_uid$7,
                                      /* [] */0
                                    ]
                                  ],
                                  /* tuple */[
                                    en2_uid,
                                    /* :: */[
                                      en2_uid,
                                      /* [] */0
                                    ]
                                  ],
                                  /* tuple */[
                                    s_uid$7,
                                    /* :: */[
                                      s_uid$7,
                                      /* [] */0
                                    ]
                                  ]
                                ])
                          ]
                        ];
                } else {
                  return ;
                }
            case /* LetL */2 :
                var s$7 = c.stack_uid;
                var s_uid$8 = s$7[0];
                var en$4 = c.env_uid;
                var en_uid$6 = en$4[0];
                var c$9 = match$14[1];
                var c_uid$8 = c$9[0];
                var e2$1 = match$15[2];
                var e2_uid$1 = e2$1[0];
                var x$5 = match$15[0];
                var x_uid$5 = x$5[0];
                var v_uid$2 = v[0];
                return /* tuple */[
                        config(zipper(focus_uid(/* Exp */Block.__(1, [e2$1])), c$9), env_uid(/* Env */[
                                  binding(x$5, v),
                                  en$4
                                ]), s$7),
                        /* tuple */[
                          "let_l",
                          Belt_MapString.fromArray([
                                /* tuple */[
                                  v_uid$2,
                                  /* :: */[
                                    v_uid$2,
                                    /* [] */0
                                  ]
                                ],
                                /* tuple */[
                                  x_uid$5,
                                  /* :: */[
                                    x_uid$5,
                                    /* [] */0
                                  ]
                                ],
                                /* tuple */[
                                  e2_uid$1,
                                  /* :: */[
                                    e2_uid$1,
                                    /* [] */0
                                  ]
                                ],
                                /* tuple */[
                                  c_uid$8,
                                  /* :: */[
                                    c_uid$8,
                                    /* [] */0
                                  ]
                                ],
                                /* tuple */[
                                  en_uid$6,
                                  /* :: */[
                                    en_uid$6,
                                    /* [] */0
                                  ]
                                ],
                                /* tuple */[
                                  s_uid$8,
                                  /* :: */[
                                    s_uid$8,
                                    /* [] */0
                                  ]
                                ]
                              ])
                        ]
                      ];
            case /* AddL */3 :
                var s$8 = c.stack_uid;
                var s_uid$9 = s$8[0];
                var en$5 = c.env_uid;
                var en_uid$7 = en$5[0];
                var c$10 = match$14[1];
                var c_uid$9 = c$10[0];
                var y$1 = match$15[1];
                var y_uid$1 = y$1[0];
                var v_uid$3 = v[0];
                return /* tuple */[
                        config(zipper(focus_uid(/* AExp */Block.__(0, [y$1])), ctxts_uid(/* Ctxt */[
                                      ctxt_uid(/* AddR */Block.__(4, [
                                              v,
                                              /* () */0
                                            ])),
                                      c$10
                                    ])), en$5, s$8),
                        /* tuple */[
                          "add_l",
                          Belt_MapString.fromArray([
                                /* tuple */[
                                  v_uid$3,
                                  /* :: */[
                                    v_uid$3,
                                    /* [] */0
                                  ]
                                ],
                                /* tuple */[
                                  y_uid$1,
                                  /* :: */[
                                    y_uid$1,
                                    /* [] */0
                                  ]
                                ],
                                /* tuple */[
                                  c_uid$9,
                                  /* :: */[
                                    c_uid$9,
                                    /* [] */0
                                  ]
                                ],
                                /* tuple */[
                                  en_uid$7,
                                  /* :: */[
                                    en_uid$7,
                                    /* [] */0
                                  ]
                                ],
                                /* tuple */[
                                  s_uid$9,
                                  /* :: */[
                                    s_uid$9,
                                    /* [] */0
                                  ]
                                ]
                              ])
                        ]
                      ];
            case /* AddR */4 :
                if (match$13.tag) {
                  return ;
                } else {
                  var match$18 = match.ctxts_uid[1];
                  var match$19 = match$18[0][1][0][1];
                  var y$2 = match$13[0];
                  if (match$19.tag) {
                    return ;
                  } else {
                    var x$6 = match$19[0];
                    var s$9 = c.stack_uid;
                    var en$6 = c.env_uid;
                    var c$11 = match$18[1];
                    var z_uid = "sum_" + String(readAndUpdateCounter(/* () */0));
                    var z_val = x$6[1] + y$2[1] | 0;
                    var s_uid$10 = s$9[0];
                    var en_uid$8 = en$6[0];
                    var c_uid$10 = c$11[0];
                    return /* tuple */[
                            config(zipper(focus_uid(/* Value */Block.__(2, [value_uid(/* VNum */Block.__(0, [/* tuple */[
                                                      z_uid,
                                                      z_val
                                                    ]]))])), c$11), en$6, s$9),
                            /* tuple */[
                              "add_r",
                              Belt_MapString.fromArray([
                                    /* tuple */[
                                      x$6[0],
                                      /* :: */[
                                        z_uid,
                                        /* [] */0
                                      ]
                                    ],
                                    /* tuple */[
                                      y$2[0],
                                      /* :: */[
                                        z_uid,
                                        /* [] */0
                                      ]
                                    ],
                                    /* tuple */[
                                      c_uid$10,
                                      /* :: */[
                                        c_uid$10,
                                        /* [] */0
                                      ]
                                    ],
                                    /* tuple */[
                                      en_uid$8,
                                      /* :: */[
                                        en_uid$8,
                                        /* [] */0
                                      ]
                                    ],
                                    /* tuple */[
                                      s_uid$10,
                                      /* :: */[
                                        s_uid$10,
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
          var match$20 = c.stack_uid[1];
          if (match$20) {
            var s$10 = match$20[1];
            var s_uid$11 = s$10[0];
            var match$21 = match$20[0];
            var env2$1 = match$21.env_uid;
            var en2_uid$1 = env2$1[0];
            var c$12 = match$21.ctxts_uid;
            var c_uid$11 = c$12[0];
            var v_uid$4 = v[0];
            return /* tuple */[
                    config(zipper(focus_uid(/* Value */Block.__(2, [v])), c$12), env2$1, s$10),
                    /* tuple */[
                      "app_exit",
                      Belt_MapString.fromArray([
                            /* tuple */[
                              v_uid$4,
                              /* :: */[
                                v_uid$4,
                                /* [] */0
                              ]
                            ],
                            /* tuple */[
                              c.env_uid[0],
                              /* [] */0
                            ],
                            /* tuple */[
                              c_uid$11,
                              /* :: */[
                                c_uid$11,
                                /* [] */0
                              ]
                            ],
                            /* tuple */[
                              en2_uid$1,
                              /* :: */[
                                en2_uid$1,
                                /* [] */0
                              ]
                            ],
                            /* tuple */[
                              s_uid$11,
                              /* :: */[
                                s_uid$11,
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

var vidToUID = vid;

var intToUID = int_uid;

function lambdaToUID(param) {
  return lambda(vid(param.vid), expToUID(param.exp));
}

function aexpToUID(ae) {
  var tmp;
  switch (ae.tag | 0) {
    case /* Var */0 :
        tmp = /* Var */Block.__(0, [vid(ae[0])]);
        break;
    case /* App */1 :
        tmp = /* App */Block.__(1, [
            aexpToUID(ae[0]),
            aexpToUID(ae[1])
          ]);
        break;
    case /* Lam */2 :
        tmp = /* Lam */Block.__(2, [lambdaToUID(ae[0])]);
        break;
    case /* Num */3 :
        tmp = /* Num */Block.__(3, [int_uid(ae[0])]);
        break;
    case /* Add */4 :
        tmp = /* Add */Block.__(4, [
            aexpToUID(ae[0]),
            aexpToUID(ae[1])
          ]);
        break;
    case /* Bracket */5 :
        tmp = /* Bracket */Block.__(5, [expToUID(ae[0])]);
        break;
    
  }
  return aexp_uid(tmp);
}

function expToUID(e) {
  var tmp;
  tmp = e.tag ? /* Let */Block.__(1, [
        vid(e[0]),
        aexpToUID(e[1]),
        expToUID(e[2])
      ]) : /* Lift */Block.__(0, [aexpToUID(e[0])]);
  return exp_uid(tmp);
}

function valueToUID(v) {
  var tmp;
  tmp = v.tag ? /* Clo */Block.__(1, [
        lambdaToUID(v[0]),
        envToUID(v[1])
      ]) : /* VNum */Block.__(0, [int_uid(v[0])]);
  return value_uid(tmp);
}

function bindingToUID(param) {
  return binding(vid(param.vid), valueToUID(param.value));
}

function envToUID(e) {
  return env_uid(e ? /* Env */[
                bindingToUID(e[0]),
                envToUID(e[1])
              ] : /* Empty */0);
}

function ctxtToUID(c) {
  var tmp;
  switch (c.tag | 0) {
    case /* AppL */0 :
        tmp = /* AppL */Block.__(0, [
            /* () */0,
            aexpToUID(c[1])
          ]);
        break;
    case /* AppR */1 :
        tmp = /* AppR */Block.__(1, [
            valueToUID(c[0]),
            /* () */0
          ]);
        break;
    case /* LetL */2 :
        tmp = /* LetL */Block.__(2, [
            vid(c[0]),
            /* () */0,
            expToUID(c[2])
          ]);
        break;
    case /* AddL */3 :
        tmp = /* AddL */Block.__(3, [
            /* () */0,
            aexpToUID(c[1])
          ]);
        break;
    case /* AddR */4 :
        tmp = /* AddR */Block.__(4, [
            valueToUID(c[0]),
            /* () */0
          ]);
        break;
    
  }
  return ctxt_uid(tmp);
}

function ctxtsToUID(cs) {
  return ctxts_uid(cs ? /* Ctxt */[
                ctxtToUID(cs[0]),
                ctxtsToUID(cs[1])
              ] : /* Empty */0);
}

function focusToUID(f) {
  var tmp;
  switch (f.tag | 0) {
    case /* AExp */0 :
        tmp = /* AExp */Block.__(0, [aexpToUID(f[0])]);
        break;
    case /* Exp */1 :
        tmp = /* Exp */Block.__(1, [expToUID(f[0])]);
        break;
    case /* Value */2 :
        tmp = /* Value */Block.__(2, [valueToUID(f[0])]);
        break;
    
  }
  return focus_uid(tmp);
}

function zipperToUID(param) {
  return zipper(focusToUID(param.focus), ctxtsToUID(param.ctxts));
}

function frameToUID(param) {
  return frame(ctxtsToUID(param.ctxts), envToUID(param.env));
}

function stackToUID(s) {
  return stack_uid(s ? /* Stack */[
                frameToUID(s[0]),
                stackToUID(s[1])
              ] : /* Empty */0);
}

function configToUID(param) {
  return config(zipperToUID(param.zipper), envToUID(param.env), stackToUID(param.stack));
}

function vidFromUID(param) {
  return param[1];
}

function intFromUID(param) {
  return param[1];
}

function lambdaFromUID(param) {
  return {
          vid: vidFromUID(param.vid),
          exp: expFromUID(param.exp_uid)
        };
}

function aexpFromUID(param) {
  var ae = param[1];
  switch (ae.tag | 0) {
    case /* Var */0 :
        return /* Var */Block.__(0, [vidFromUID(ae[0])]);
    case /* App */1 :
        return /* App */Block.__(1, [
                  aexpFromUID(ae[0]),
                  aexpFromUID(ae[1])
                ]);
    case /* Lam */2 :
        return /* Lam */Block.__(2, [lambdaFromUID(ae[0])]);
    case /* Num */3 :
        return /* Num */Block.__(3, [intFromUID(ae[0])]);
    case /* Add */4 :
        return /* Add */Block.__(4, [
                  aexpFromUID(ae[0]),
                  aexpFromUID(ae[1])
                ]);
    case /* Bracket */5 :
        return /* Bracket */Block.__(5, [expFromUID(ae[0])]);
    
  }
}

function expFromUID(param) {
  var e = param[1];
  if (e.tag) {
    return /* Let */Block.__(1, [
              vidFromUID(e[0]),
              aexpFromUID(e[1]),
              expFromUID(e[2])
            ]);
  } else {
    return /* Lift */Block.__(0, [aexpFromUID(e[0])]);
  }
}

function valueFromUID(param) {
  var v = param[1];
  if (v.tag) {
    return /* Clo */Block.__(1, [
              lambdaFromUID(v[0]),
              envFromUID(v[1])
            ]);
  } else {
    return /* VNum */Block.__(0, [intFromUID(v[0])]);
  }
}

function bindingFromUID(param) {
  return {
          vid: vidFromUID(param.vid),
          value: valueFromUID(param.value_uid)
        };
}

function envFromUID(param) {
  var e = param[1];
  if (e) {
    return /* :: */[
            bindingFromUID(e[0]),
            envFromUID(e[1])
          ];
  } else {
    return /* [] */0;
  }
}

function ctxtFromUID(param) {
  var c = param[1];
  switch (c.tag | 0) {
    case /* AppL */0 :
        return /* AppL */Block.__(0, [
                  /* () */0,
                  aexpFromUID(c[1])
                ]);
    case /* AppR */1 :
        return /* AppR */Block.__(1, [
                  valueFromUID(c[0]),
                  /* () */0
                ]);
    case /* LetL */2 :
        return /* LetL */Block.__(2, [
                  vidFromUID(c[0]),
                  /* () */0,
                  expFromUID(c[2])
                ]);
    case /* AddL */3 :
        return /* AddL */Block.__(3, [
                  /* () */0,
                  aexpFromUID(c[1])
                ]);
    case /* AddR */4 :
        return /* AddR */Block.__(4, [
                  valueFromUID(c[0]),
                  /* () */0
                ]);
    
  }
}

function ctxtsFromUID(param) {
  var cs = param[1];
  if (cs) {
    return /* :: */[
            ctxtFromUID(cs[0]),
            ctxtsFromUID(cs[1])
          ];
  } else {
    return /* [] */0;
  }
}

function focusFromUID(param) {
  var f = param[1];
  switch (f.tag | 0) {
    case /* AExp */0 :
        return /* AExp */Block.__(0, [aexpFromUID(f[0])]);
    case /* Exp */1 :
        return /* Exp */Block.__(1, [expFromUID(f[0])]);
    case /* Value */2 :
        return /* Value */Block.__(2, [valueFromUID(f[0])]);
    
  }
}

function zipperFromUID(param) {
  return {
          focus: focusFromUID(param.focus_uid),
          ctxts: ctxtsFromUID(param.ctxts_uid)
        };
}

function frameFromUID(param) {
  return {
          ctxts: ctxtsFromUID(param.ctxts_uid),
          env: envFromUID(param.env_uid)
        };
}

function stackFromUID(param) {
  var s = param[1];
  if (s) {
    return /* :: */[
            frameFromUID(s[0]),
            stackFromUID(s[1])
          ];
  } else {
    return /* [] */0;
  }
}

function configFromUID(param) {
  return {
          zipper: zipperFromUID(param.zipper),
          env: envFromUID(param.env_uid),
          stack: stackFromUID(param.stack_uid)
        };
}

function inject(e) {
  return config(zipper(focus_uid(/* Exp */Block.__(1, [expToUID(e)])), ctxts_uid(/* Empty */0)), env_uid(/* Empty */0), stack_uid(/* Empty */0));
}

function isFinal(c) {
  var match = c.zipper;
  switch (match.focus_uid[1].tag | 0) {
    case /* AExp */0 :
    case /* Exp */1 :
        return false;
    case /* Value */2 :
        if (match.ctxts_uid[1] || c.stack_uid[1]) {
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
  console.log("rules", $$Array.of_list(rules));
  return List.combine(Pervasives.$at(rules, /* :: */[
                  /* tuple */[
                    "",
                    Belt_MapString.empty
                  ],
                  /* [] */0
                ]), takeWhileInclusive((function (c) {
                    return !isFinal(c);
                  }), match[0]));
}

function interpret(p) {
  var match = List.hd(List.rev(interpretTrace(p)));
  var match$1 = match[1].zipper.focus_uid[1];
  switch (match$1.tag | 0) {
    case /* AExp */0 :
    case /* Exp */1 :
        throw Pervasives.failwith("expected a value");
    case /* Value */2 :
        return valueFromUID(match$1[0]);
    
  }
}

var loading = inject(/* Lift */Block.__(0, [/* Var */Block.__(0, ["loading..."])]));

var MS = /* alias */0;

var advance = step;

exports.counter = counter;
exports.readAndUpdateCounter = readAndUpdateCounter;
exports.rauc = rauc;
exports.vid = vid;
exports.int_uid = int_uid;
exports.lambda = lambda;
exports.aexp_uid = aexp_uid;
exports.exp_uid = exp_uid;
exports.value_uid = value_uid;
exports.binding = binding;
exports.env_uid = env_uid;
exports.ctxt_uid = ctxt_uid;
exports.focus_uid = focus_uid;
exports.ctxts_uid = ctxts_uid;
exports.zipper = zipper;
exports.frame = frame;
exports.stack_uid = stack_uid;
exports.config = config;
exports.MS = MS;
exports.lookup = lookup;
exports.flowMerge = flowMerge;
exports.step = step;
exports.vidToUID = vidToUID;
exports.intToUID = intToUID;
exports.lambdaToUID = lambdaToUID;
exports.aexpToUID = aexpToUID;
exports.expToUID = expToUID;
exports.valueToUID = valueToUID;
exports.bindingToUID = bindingToUID;
exports.envToUID = envToUID;
exports.ctxtToUID = ctxtToUID;
exports.ctxtsToUID = ctxtsToUID;
exports.focusToUID = focusToUID;
exports.zipperToUID = zipperToUID;
exports.frameToUID = frameToUID;
exports.stackToUID = stackToUID;
exports.configToUID = configToUID;
exports.vidFromUID = vidFromUID;
exports.intFromUID = intFromUID;
exports.lambdaFromUID = lambdaFromUID;
exports.aexpFromUID = aexpFromUID;
exports.expFromUID = expFromUID;
exports.valueFromUID = valueFromUID;
exports.bindingFromUID = bindingFromUID;
exports.envFromUID = envFromUID;
exports.ctxtFromUID = ctxtFromUID;
exports.ctxtsFromUID = ctxtsFromUID;
exports.focusFromUID = focusFromUID;
exports.zipperFromUID = zipperFromUID;
exports.frameFromUID = frameFromUID;
exports.stackFromUID = stackFromUID;
exports.configFromUID = configFromUID;
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
/* loading Not a pure module */
