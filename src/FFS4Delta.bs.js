'use strict';

var List = require("bs-platform/lib/js/list.js");
var $$Array = require("bs-platform/lib/js/array.js");
var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");

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
          String(readAndUpdateCounter(/* () */0)),
          x
        ];
}

function int_uid(n) {
  return /* tuple */[
          String(readAndUpdateCounter(/* () */0)),
          n
        ];
}

function lambda(vid, exp_uid) {
  return {
          uid: String(readAndUpdateCounter(/* () */0)),
          vid: vid,
          exp_uid: exp_uid
        };
}

function aexp_uid(ae) {
  return /* tuple */[
          String(readAndUpdateCounter(/* () */0)),
          ae
        ];
}

function exp_uid(e) {
  return /* tuple */[
          String(readAndUpdateCounter(/* () */0)),
          e
        ];
}

function value_uid(v) {
  return /* tuple */[
          String(readAndUpdateCounter(/* () */0)),
          v
        ];
}

function binding(vid, value_uid) {
  return {
          uid: String(readAndUpdateCounter(/* () */0)),
          vid: vid,
          value_uid: value_uid
        };
}

function env_uid(bs) {
  return /* tuple */[
          String(readAndUpdateCounter(/* () */0)),
          bs
        ];
}

function ctxt_uid(c) {
  return /* tuple */[
          String(readAndUpdateCounter(/* () */0)),
          c
        ];
}

function focus_uid(f) {
  return /* tuple */[
          String(readAndUpdateCounter(/* () */0)),
          f
        ];
}

function ctxts_uid(cs) {
  return /* tuple */[
          String(readAndUpdateCounter(/* () */0)),
          cs
        ];
}

function frame(ctxts_uid, env_uid) {
  return {
          uid: String(readAndUpdateCounter(/* () */0)),
          ctxts_uid: ctxts_uid,
          env_uid: env_uid
        };
}

function stack_uid(fs) {
  return /* tuple */[
          String(readAndUpdateCounter(/* () */0)),
          fs
        ];
}

function config(focus_uid, frame, stack_uid) {
  return {
          uid: String(readAndUpdateCounter(/* () */0)),
          focus_uid: focus_uid,
          frame: frame,
          stack_uid: stack_uid
        };
}

function lookup(x, _env) {
  while(true) {
    var env = _env;
    var env_val = env[1];
    if (env_val) {
      var match = env_val[0];
      var env_uid = env[0];
      if (x[1] === match.vid[1]) {
        var fresh = String(readAndUpdateCounter(/* () */0));
        return /* tuple */[
                /* tuple */[
                  fresh,
                  match.value_uid[1]
                ],
                /* :: */[
                  {
                    left: x[0],
                    right: /* :: */[
                      fresh,
                      /* [] */0
                    ]
                  },
                  /* :: */[
                    {
                      left: env_uid,
                      right: /* :: */[
                        fresh,
                        /* [] */0
                      ]
                    },
                    /* [] */0
                  ]
                ]
              ];
      } else {
        _env = /* tuple */[
          env_uid,
          env_val[1][1]
        ];
        continue ;
      }
    } else {
      return ;
    }
  };
}

function step(c) {
  var match = c.focus_uid[1];
  switch (match.tag | 0) {
    case /* AExp */0 :
        var match$1 = match[0][1];
        switch (match$1.tag | 0) {
          case /* Var */0 :
              var match$2 = c.stack_uid;
              var stack_uid = match$2[0];
              var match$3 = c.frame;
              var match$4 = match$3.env_uid;
              var env_val = match$4[1];
              var env_uid = match$4[0];
              var match$5 = match$3.ctxts_uid;
              var ctxts_uid = match$5[0];
              var match$6 = lookup(match$1[0], /* tuple */[
                    env_uid,
                    env_val
                  ]);
              if (match$6 !== undefined) {
                var match$7 = match$6;
                var match$8 = match$7[0];
                return /* tuple */[
                        config(/* tuple */[
                              String(readAndUpdateCounter(/* () */0)),
                              /* Value */Block.__(2, [/* tuple */[
                                    match$8[0],
                                    match$8[1]
                                  ]])
                            ], frame(/* tuple */[
                                  ctxts_uid,
                                  match$5[1]
                                ], /* tuple */[
                                  env_uid,
                                  env_val
                                ]), /* tuple */[
                              stack_uid,
                              match$2[1]
                            ]),
                        /* tuple */[
                          "var",
                          /* :: */[
                            {
                              left: ctxts_uid,
                              right: /* :: */[
                                ctxts_uid,
                                /* [] */0
                              ]
                            },
                            /* :: */[
                              {
                                left: env_uid,
                                right: /* :: */[
                                  env_uid,
                                  /* [] */0
                                ]
                              },
                              /* :: */[
                                {
                                  left: stack_uid,
                                  right: /* :: */[
                                    stack_uid,
                                    /* [] */0
                                  ]
                                },
                                match$7[1]
                              ]
                            ]
                          ]
                        ]
                      ];
              } else {
                return ;
              }
          case /* App */1 :
              var s = c.stack_uid;
              var s_uid = s[0];
              var match$9 = c.frame;
              var env = match$9.env_uid;
              var env_uid$1 = env[0];
              var c$1 = match$9.ctxts_uid;
              var c_uid = c$1[0];
              var x = match$1[1];
              var x_uid = x[0];
              var f = match$1[0];
              var f_uid = f[0];
              return /* tuple */[
                      config(/* tuple */[
                            String(readAndUpdateCounter(/* () */0)),
                            /* AExp */Block.__(0, [f])
                          ], frame(/* tuple */[
                                String(readAndUpdateCounter(/* () */0)),
                                /* Ctxt */[
                                  /* tuple */[
                                    String(readAndUpdateCounter(/* () */0)),
                                    /* AppL */Block.__(0, [
                                        /* () */0,
                                        x
                                      ])
                                  ],
                                  c$1
                                ]
                              ], env), s),
                      /* tuple */[
                        "app_begin",
                        /* :: */[
                          {
                            left: f_uid,
                            right: /* :: */[
                              f_uid,
                              /* [] */0
                            ]
                          },
                          /* :: */[
                            {
                              left: x_uid,
                              right: /* :: */[
                                x_uid,
                                /* [] */0
                              ]
                            },
                            /* :: */[
                              {
                                left: c_uid,
                                right: /* :: */[
                                  c_uid,
                                  /* [] */0
                                ]
                              },
                              /* :: */[
                                {
                                  left: env_uid$1,
                                  right: /* :: */[
                                    env_uid$1,
                                    /* [] */0
                                  ]
                                },
                                /* :: */[
                                  {
                                    left: s_uid,
                                    right: /* :: */[
                                      s_uid,
                                      /* [] */0
                                    ]
                                  },
                                  /* [] */0
                                ]
                              ]
                            ]
                          ]
                        ]
                      ]
                    ];
          case /* Lam */2 :
              var match$10 = c.stack_uid;
              var stack_uid$1 = match$10[0];
              var match$11 = c.frame;
              var match$12 = match$11.env_uid;
              var env_val$1 = match$12[1];
              var env_uid$2 = match$12[0];
              var match$13 = match$11.ctxts_uid;
              var ctxts_uid$1 = match$13[0];
              var l = match$1[0];
              var l_uid = l.uid;
              var env_uid2 = String(readAndUpdateCounter(/* () */0));
              return /* tuple */[
                      config(/* tuple */[
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
                          ], frame(/* tuple */[
                                ctxts_uid$1,
                                match$13[1]
                              ], /* tuple */[
                                env_uid$2,
                                env_val$1
                              ]), /* tuple */[
                            stack_uid$1,
                            match$10[1]
                          ]),
                      /* tuple */[
                        "lam",
                        /* :: */[
                          {
                            left: l_uid,
                            right: /* :: */[
                              l_uid,
                              /* [] */0
                            ]
                          },
                          /* :: */[
                            {
                              left: ctxts_uid$1,
                              right: /* :: */[
                                ctxts_uid$1,
                                /* [] */0
                              ]
                            },
                            /* :: */[
                              {
                                left: env_uid$2,
                                right: /* :: */[
                                  env_uid$2,
                                  /* :: */[
                                    env_uid2,
                                    /* [] */0
                                  ]
                                ]
                              },
                              /* :: */[
                                {
                                  left: stack_uid$1,
                                  right: /* :: */[
                                    stack_uid$1,
                                    /* [] */0
                                  ]
                                },
                                /* [] */0
                              ]
                            ]
                          ]
                        ]
                      ]
                    ];
          case /* Num */3 :
              var n = match$1[0];
              var n_uid = n[0];
              var s$1 = c.stack_uid;
              var f$1 = c.frame;
              var f_uid$1 = f$1.uid;
              var s_uid$1 = s$1[0];
              var f$2 = /* Value */Block.__(2, [/* tuple */[
                    String(readAndUpdateCounter(/* () */0)),
                    /* VNum */Block.__(0, [n])
                  ]]);
              return /* tuple */[
                      config(/* tuple */[
                            String(readAndUpdateCounter(/* () */0)),
                            f$2
                          ], f$1, s$1),
                      /* tuple */[
                        "num",
                        /* :: */[
                          {
                            left: n_uid,
                            right: /* :: */[
                              n_uid,
                              /* [] */0
                            ]
                          },
                          /* :: */[
                            {
                              left: f_uid$1,
                              right: /* :: */[
                                f_uid$1,
                                /* [] */0
                              ]
                            },
                            /* :: */[
                              {
                                left: s_uid$1,
                                right: /* :: */[
                                  s_uid$1,
                                  /* [] */0
                                ]
                              },
                              /* [] */0
                            ]
                          ]
                        ]
                      ]
                    ];
          case /* Add */4 :
              var s$2 = c.stack_uid;
              var s_uid$2 = s$2[0];
              var match$14 = c.frame;
              var en = match$14.env_uid;
              var en_uid = en[0];
              var c$2 = match$14.ctxts_uid;
              var c_uid$1 = c$2[0];
              var y = match$1[1];
              var y_uid = y[0];
              var x$1 = match$1[0];
              var x_uid$1 = x$1[0];
              var cs_000 = /* tuple */[
                String(readAndUpdateCounter(/* () */0)),
                /* AddL */Block.__(3, [
                    /* () */0,
                    y
                  ])
              ];
              var cs = /* Ctxt */[
                cs_000,
                c$2
              ];
              return /* tuple */[
                      config(/* tuple */[
                            String(readAndUpdateCounter(/* () */0)),
                            /* AExp */Block.__(0, [x$1])
                          ], frame(/* tuple */[
                                String(readAndUpdateCounter(/* () */0)),
                                cs
                              ], en), s$2),
                      /* tuple */[
                        "add_begin",
                        /* :: */[
                          {
                            left: x_uid$1,
                            right: /* :: */[
                              x_uid$1,
                              /* [] */0
                            ]
                          },
                          /* :: */[
                            {
                              left: y_uid,
                              right: /* :: */[
                                y_uid,
                                /* [] */0
                              ]
                            },
                            /* :: */[
                              {
                                left: c_uid$1,
                                right: /* :: */[
                                  c_uid$1,
                                  /* [] */0
                                ]
                              },
                              /* :: */[
                                {
                                  left: en_uid,
                                  right: /* :: */[
                                    en_uid,
                                    /* [] */0
                                  ]
                                },
                                /* :: */[
                                  {
                                    left: s_uid$2,
                                    right: /* :: */[
                                      s_uid$2,
                                      /* [] */0
                                    ]
                                  },
                                  /* [] */0
                                ]
                              ]
                            ]
                          ]
                        ]
                      ]
                    ];
          case /* Bracket */5 :
              var match$15 = c.frame;
              var en$1 = match$15.env_uid;
              var en_uid$1 = en$1[0];
              var c$3 = match$15.ctxts_uid;
              var c_uid$2 = c$3[0];
              var e = match$1[0];
              var e_uid = e[0];
              var s$3 = c.stack_uid;
              var en_uid2 = String(readAndUpdateCounter(/* () */0));
              var s_uid$3 = s$3[0];
              var fs_000 = frame(c$3, /* tuple */[
                    en_uid2,
                    en$1[1]
                  ]);
              var fs = /* Stack */[
                fs_000,
                s$3
              ];
              return /* tuple */[
                      config(/* tuple */[
                            String(readAndUpdateCounter(/* () */0)),
                            /* Exp */Block.__(1, [e])
                          ], frame(/* tuple */[
                                String(readAndUpdateCounter(/* () */0)),
                                /* Empty */0
                              ], en$1), /* tuple */[
                            String(readAndUpdateCounter(/* () */0)),
                            fs
                          ]),
                      /* tuple */[
                        "bracket",
                        /* :: */[
                          {
                            left: e_uid,
                            right: /* :: */[
                              e_uid,
                              /* [] */0
                            ]
                          },
                          /* :: */[
                            {
                              left: c_uid$2,
                              right: /* :: */[
                                c_uid$2,
                                /* [] */0
                              ]
                            },
                            /* :: */[
                              {
                                left: en_uid$1,
                                right: /* :: */[
                                  en_uid$1,
                                  /* :: */[
                                    en_uid2,
                                    /* [] */0
                                  ]
                                ]
                              },
                              /* :: */[
                                {
                                  left: s_uid$3,
                                  right: /* :: */[
                                    s_uid$3,
                                    /* [] */0
                                  ]
                                },
                                /* [] */0
                              ]
                            ]
                          ]
                        ]
                      ]
                    ];
          
        }
    case /* Exp */1 :
        var match$16 = match[0][1];
        if (match$16.tag) {
          var stack_uid$2 = c.stack_uid;
          var s_uid$4 = stack_uid$2[0];
          var match$17 = c.frame;
          var env_uid$3 = match$17.env_uid;
          var en_uid$2 = env_uid$3[0];
          var c$4 = match$17.ctxts_uid;
          var c_uid$3 = c$4[0];
          var e2 = match$16[2];
          var e2_uid = e2[0];
          var ae1 = match$16[1];
          var ae1_uid = ae1[0];
          var x$2 = match$16[0];
          var x_uid$2 = x$2[0];
          var cs_000$1 = /* tuple */[
            String(readAndUpdateCounter(/* () */0)),
            /* LetL */Block.__(2, [
                x$2,
                /* () */0,
                e2
              ])
          ];
          var cs$1 = /* Ctxt */[
            cs_000$1,
            c$4
          ];
          return /* tuple */[
                  config(/* tuple */[
                        String(readAndUpdateCounter(/* () */0)),
                        /* AExp */Block.__(0, [ae1])
                      ], frame(/* tuple */[
                            String(readAndUpdateCounter(/* () */0)),
                            cs$1
                          ], env_uid$3), stack_uid$2),
                  /* tuple */[
                    "let_begin",
                    /* :: */[
                      {
                        left: x_uid$2,
                        right: /* :: */[
                          x_uid$2,
                          /* [] */0
                        ]
                      },
                      /* :: */[
                        {
                          left: ae1_uid,
                          right: /* :: */[
                            ae1_uid,
                            /* [] */0
                          ]
                        },
                        /* :: */[
                          {
                            left: e2_uid,
                            right: /* :: */[
                              e2_uid,
                              /* [] */0
                            ]
                          },
                          /* :: */[
                            {
                              left: c_uid$3,
                              right: /* :: */[
                                c_uid$3,
                                /* [] */0
                              ]
                            },
                            /* :: */[
                              {
                                left: en_uid$2,
                                right: /* :: */[
                                  en_uid$2,
                                  /* [] */0
                                ]
                              },
                              /* :: */[
                                {
                                  left: s_uid$4,
                                  right: /* :: */[
                                    s_uid$4,
                                    /* [] */0
                                  ]
                                },
                                /* [] */0
                              ]
                            ]
                          ]
                        ]
                      ]
                    ]
                  ]
                ];
        } else {
          var a = match$16[0];
          var a_uid = a[0];
          var s$4 = c.stack_uid;
          var f$3 = c.frame;
          var f_uid$2 = f$3.uid;
          var s_uid$5 = s$4[0];
          return /* tuple */[
                  config(/* tuple */[
                        String(readAndUpdateCounter(/* () */0)),
                        /* AExp */Block.__(0, [a])
                      ], f$3, s$4),
                  /* tuple */[
                    "lift",
                    /* :: */[
                      {
                        left: a_uid,
                        right: /* :: */[
                          a_uid,
                          /* [] */0
                        ]
                      },
                      /* :: */[
                        {
                          left: f_uid$2,
                          right: /* :: */[
                            f_uid$2,
                            /* [] */0
                          ]
                        },
                        /* :: */[
                          {
                            left: s_uid$5,
                            right: /* :: */[
                              s_uid$5,
                              /* [] */0
                            ]
                          },
                          /* [] */0
                        ]
                      ]
                    ]
                  ]
                ];
        }
    case /* Value */2 :
        var v = match[0];
        var match$18 = v[1];
        var match$19 = c.frame;
        var match$20 = match$19.ctxts_uid[1];
        if (match$20) {
          var match$21 = match$20[0][1];
          switch (match$21.tag | 0) {
            case /* AppL */0 :
                var s$5 = c.stack_uid;
                var s_uid$6 = s$5[0];
                var env$1 = match$19.env_uid;
                var env_uid$4 = env$1[0];
                var c$5 = match$20[1];
                var c_uid$4 = c$5[0];
                var x$3 = match$21[1];
                var x_uid$3 = x$3[0];
                var v_uid = v[0];
                var cs_000$2 = /* tuple */[
                  String(readAndUpdateCounter(/* () */0)),
                  /* AppR */Block.__(1, [
                      v,
                      /* () */0
                    ])
                ];
                var cs$2 = /* Ctxt */[
                  cs_000$2,
                  c$5
                ];
                return /* tuple */[
                        config(/* tuple */[
                              String(readAndUpdateCounter(/* () */0)),
                              /* AExp */Block.__(0, [x$3])
                            ], frame(/* tuple */[
                                  String(readAndUpdateCounter(/* () */0)),
                                  cs$2
                                ], env$1), s$5),
                        /* tuple */[
                          "app_l",
                          /* :: */[
                            {
                              left: v_uid,
                              right: /* :: */[
                                v_uid,
                                /* [] */0
                              ]
                            },
                            /* :: */[
                              {
                                left: x_uid$3,
                                right: /* :: */[
                                  x_uid$3,
                                  /* [] */0
                                ]
                              },
                              /* :: */[
                                {
                                  left: c_uid$4,
                                  right: /* :: */[
                                    c_uid$4,
                                    /* [] */0
                                  ]
                                },
                                /* :: */[
                                  {
                                    left: env_uid$4,
                                    right: /* :: */[
                                      env_uid$4,
                                      /* [] */0
                                    ]
                                  },
                                  /* :: */[
                                    {
                                      left: s_uid$6,
                                      right: /* :: */[
                                        s_uid$6,
                                        /* [] */0
                                      ]
                                    },
                                    /* [] */0
                                  ]
                                ]
                              ]
                            ]
                          ]
                        ]
                      ];
            case /* AppR */1 :
                var match$22 = match$21[0][1];
                if (match$22.tag) {
                  var s$6 = c.stack_uid;
                  var s_uid$7 = s$6[0];
                  var env2 = match$19.env_uid;
                  var en2_uid = env2[0];
                  var c$6 = match$20[1];
                  var c_uid$5 = c$6[0];
                  var env$2 = match$22[1];
                  var en_uid$3 = env$2[0];
                  var match$23 = match$22[0];
                  var e$1 = match$23.exp_uid;
                  var e_uid$1 = e$1[0];
                  var x$4 = match$23.vid;
                  var x_uid$4 = x$4[0];
                  var v_uid$1 = v[0];
                  var bs_000 = binding(x$4, v);
                  var bs = /* Env */[
                    bs_000,
                    env$2
                  ];
                  var fs_000$1 = frame(c$6, env2);
                  var fs$1 = /* Stack */[
                    fs_000$1,
                    s$6
                  ];
                  return /* tuple */[
                          config(/* tuple */[
                                String(readAndUpdateCounter(/* () */0)),
                                /* Exp */Block.__(1, [e$1])
                              ], frame(/* tuple */[
                                    String(readAndUpdateCounter(/* () */0)),
                                    /* Empty */0
                                  ], /* tuple */[
                                    String(readAndUpdateCounter(/* () */0)),
                                    bs
                                  ]), /* tuple */[
                                String(readAndUpdateCounter(/* () */0)),
                                fs$1
                              ]),
                          /* tuple */[
                            "app_r",
                            /* :: */[
                              {
                                left: v_uid$1,
                                right: /* :: */[
                                  v_uid$1,
                                  /* [] */0
                                ]
                              },
                              /* :: */[
                                {
                                  left: x_uid$4,
                                  right: /* :: */[
                                    x_uid$4,
                                    /* [] */0
                                  ]
                                },
                                /* :: */[
                                  {
                                    left: e_uid$1,
                                    right: /* :: */[
                                      e_uid$1,
                                      /* [] */0
                                    ]
                                  },
                                  /* :: */[
                                    {
                                      left: en_uid$3,
                                      right: /* :: */[
                                        en_uid$3,
                                        /* [] */0
                                      ]
                                    },
                                    /* :: */[
                                      {
                                        left: c_uid$5,
                                        right: /* :: */[
                                          c_uid$5,
                                          /* [] */0
                                        ]
                                      },
                                      /* :: */[
                                        {
                                          left: en2_uid,
                                          right: /* :: */[
                                            en2_uid,
                                            /* [] */0
                                          ]
                                        },
                                        /* :: */[
                                          {
                                            left: s_uid$7,
                                            right: /* :: */[
                                              s_uid$7,
                                              /* [] */0
                                            ]
                                          },
                                          /* [] */0
                                        ]
                                      ]
                                    ]
                                  ]
                                ]
                              ]
                            ]
                          ]
                        ];
                } else {
                  return ;
                }
            case /* LetL */2 :
                var s$7 = c.stack_uid;
                var s_uid$8 = s$7[0];
                var en$2 = match$19.env_uid;
                var en_uid$4 = en$2[0];
                var c$7 = match$20[1];
                var c_uid$6 = c$7[0];
                var e2$1 = match$21[2];
                var e2_uid$1 = e2$1[0];
                var x$5 = match$21[0];
                var x_uid$5 = x$5[0];
                var v_uid$2 = v[0];
                var bs_000$1 = binding(x$5, v);
                var bs$1 = /* Env */[
                  bs_000$1,
                  en$2
                ];
                return /* tuple */[
                        config(/* tuple */[
                              String(readAndUpdateCounter(/* () */0)),
                              /* Exp */Block.__(1, [e2$1])
                            ], frame(c$7, /* tuple */[
                                  String(readAndUpdateCounter(/* () */0)),
                                  bs$1
                                ]), s$7),
                        /* tuple */[
                          "let_l",
                          /* :: */[
                            {
                              left: v_uid$2,
                              right: /* :: */[
                                v_uid$2,
                                /* [] */0
                              ]
                            },
                            /* :: */[
                              {
                                left: x_uid$5,
                                right: /* :: */[
                                  x_uid$5,
                                  /* [] */0
                                ]
                              },
                              /* :: */[
                                {
                                  left: e2_uid$1,
                                  right: /* :: */[
                                    e2_uid$1,
                                    /* [] */0
                                  ]
                                },
                                /* :: */[
                                  {
                                    left: c_uid$6,
                                    right: /* :: */[
                                      c_uid$6,
                                      /* [] */0
                                    ]
                                  },
                                  /* :: */[
                                    {
                                      left: en_uid$4,
                                      right: /* :: */[
                                        en_uid$4,
                                        /* [] */0
                                      ]
                                    },
                                    /* :: */[
                                      {
                                        left: s_uid$8,
                                        right: /* :: */[
                                          s_uid$8,
                                          /* [] */0
                                        ]
                                      },
                                      /* [] */0
                                    ]
                                  ]
                                ]
                              ]
                            ]
                          ]
                        ]
                      ];
            case /* AddL */3 :
                var s$8 = c.stack_uid;
                var s_uid$9 = s$8[0];
                var en$3 = match$19.env_uid;
                var en_uid$5 = en$3[0];
                var c$8 = match$20[1];
                var c_uid$7 = c$8[0];
                var y$1 = match$21[1];
                var y_uid$1 = y$1[0];
                var v_uid$3 = v[0];
                var cs_000$3 = /* tuple */[
                  String(readAndUpdateCounter(/* () */0)),
                  /* AddR */Block.__(4, [
                      v,
                      /* () */0
                    ])
                ];
                var cs$3 = /* Ctxt */[
                  cs_000$3,
                  c$8
                ];
                return /* tuple */[
                        config(/* tuple */[
                              String(readAndUpdateCounter(/* () */0)),
                              /* AExp */Block.__(0, [y$1])
                            ], frame(/* tuple */[
                                  String(readAndUpdateCounter(/* () */0)),
                                  cs$3
                                ], en$3), s$8),
                        /* tuple */[
                          "add_l",
                          /* :: */[
                            {
                              left: v_uid$3,
                              right: /* :: */[
                                v_uid$3,
                                /* [] */0
                              ]
                            },
                            /* :: */[
                              {
                                left: y_uid$1,
                                right: /* :: */[
                                  y_uid$1,
                                  /* [] */0
                                ]
                              },
                              /* :: */[
                                {
                                  left: c_uid$7,
                                  right: /* :: */[
                                    c_uid$7,
                                    /* [] */0
                                  ]
                                },
                                /* :: */[
                                  {
                                    left: en_uid$5,
                                    right: /* :: */[
                                      en_uid$5,
                                      /* [] */0
                                    ]
                                  },
                                  /* :: */[
                                    {
                                      left: s_uid$9,
                                      right: /* :: */[
                                        s_uid$9,
                                        /* [] */0
                                      ]
                                    },
                                    /* [] */0
                                  ]
                                ]
                              ]
                            ]
                          ]
                        ]
                      ];
            case /* AddR */4 :
                if (match$18.tag) {
                  return ;
                } else {
                  var match$24 = c.frame;
                  var match$25 = match$24.ctxts_uid[1];
                  var match$26 = match$25[0][1][0][1];
                  var y$2 = match$18[0];
                  if (match$26.tag) {
                    return ;
                  } else {
                    var x$6 = match$26[0];
                    var s$9 = c.stack_uid;
                    var en$4 = match$24.env_uid;
                    var c$9 = match$25[1];
                    var z_uid = String(readAndUpdateCounter(/* () */0));
                    var z_val = x$6[1] + y$2[1] | 0;
                    var s_uid$10 = s$9[0];
                    var en_uid$6 = en$4[0];
                    var c_uid$8 = c$9[0];
                    var f$4 = /* Value */Block.__(2, [/* tuple */[
                          String(readAndUpdateCounter(/* () */0)),
                          /* VNum */Block.__(0, [/* tuple */[
                                z_uid,
                                z_val
                              ]])
                        ]]);
                    return /* tuple */[
                            config(/* tuple */[
                                  String(readAndUpdateCounter(/* () */0)),
                                  f$4
                                ], frame(c$9, en$4), s$9),
                            /* tuple */[
                              "add_r",
                              /* :: */[
                                {
                                  left: x$6[0],
                                  right: /* :: */[
                                    z_uid,
                                    /* [] */0
                                  ]
                                },
                                /* :: */[
                                  {
                                    left: y$2[0],
                                    right: /* :: */[
                                      z_uid,
                                      /* [] */0
                                    ]
                                  },
                                  /* :: */[
                                    {
                                      left: c_uid$8,
                                      right: /* :: */[
                                        c_uid$8,
                                        /* [] */0
                                      ]
                                    },
                                    /* :: */[
                                      {
                                        left: en_uid$6,
                                        right: /* :: */[
                                          en_uid$6,
                                          /* [] */0
                                        ]
                                      },
                                      /* :: */[
                                        {
                                          left: s_uid$10,
                                          right: /* :: */[
                                            s_uid$10,
                                            /* [] */0
                                          ]
                                        },
                                        /* [] */0
                                      ]
                                    ]
                                  ]
                                ]
                              ]
                            ]
                          ];
                  }
                }
            
          }
        } else {
          var match$27 = c.stack_uid[1];
          if (match$27) {
            var v_uid$4 = v[0];
            var s$10 = match$27[1];
            var f$5 = match$27[0];
            var f_uid$3 = f$5.uid;
            var s_uid$11 = s$10[0];
            return /* tuple */[
                    config(/* tuple */[
                          String(readAndUpdateCounter(/* () */0)),
                          /* Value */Block.__(2, [v])
                        ], f$5, s$10),
                    /* tuple */[
                      "app_exit",
                      /* :: */[
                        {
                          left: v_uid$4,
                          right: /* :: */[
                            v_uid$4,
                            /* [] */0
                          ]
                        },
                        /* :: */[
                          {
                            left: match$19.env_uid[0],
                            right: /* [] */0
                          },
                          /* :: */[
                            {
                              left: f_uid$3,
                              right: /* :: */[
                                f_uid$3,
                                /* [] */0
                              ]
                            },
                            /* :: */[
                              {
                                left: s_uid$11,
                                right: /* :: */[
                                  s_uid$11,
                                  /* [] */0
                                ]
                              },
                              /* [] */0
                            ]
                          ]
                        ]
                      ]
                    ]
                  ];
          } else {
            return ;
          }
        }
    
  }
}

function vidToUID(v) {
  return /* tuple */[
          String(readAndUpdateCounter(/* () */0)),
          v
        ];
}

function intToUID(n) {
  return /* tuple */[
          String(readAndUpdateCounter(/* () */0)),
          n
        ];
}

function lambdaToUID(param) {
  return lambda(/* tuple */[
              String(readAndUpdateCounter(/* () */0)),
              param.vid
            ], expToUID(param.exp));
}

function aexpToUID(ae) {
  var ae$1;
  switch (ae.tag | 0) {
    case /* Var */0 :
        ae$1 = /* Var */Block.__(0, [/* tuple */[
              String(readAndUpdateCounter(/* () */0)),
              ae[0]
            ]]);
        break;
    case /* App */1 :
        ae$1 = /* App */Block.__(1, [
            aexpToUID(ae[0]),
            aexpToUID(ae[1])
          ]);
        break;
    case /* Lam */2 :
        ae$1 = /* Lam */Block.__(2, [lambdaToUID(ae[0])]);
        break;
    case /* Num */3 :
        ae$1 = /* Num */Block.__(3, [/* tuple */[
              String(readAndUpdateCounter(/* () */0)),
              ae[0]
            ]]);
        break;
    case /* Add */4 :
        ae$1 = /* Add */Block.__(4, [
            aexpToUID(ae[0]),
            aexpToUID(ae[1])
          ]);
        break;
    case /* Bracket */5 :
        ae$1 = /* Bracket */Block.__(5, [expToUID(ae[0])]);
        break;
    
  }
  return /* tuple */[
          String(readAndUpdateCounter(/* () */0)),
          ae$1
        ];
}

function expToUID(e) {
  var e$1;
  e$1 = e.tag ? /* Let */Block.__(1, [
        /* tuple */[
          String(readAndUpdateCounter(/* () */0)),
          e[0]
        ],
        aexpToUID(e[1]),
        expToUID(e[2])
      ]) : /* Lift */Block.__(0, [aexpToUID(e[0])]);
  return /* tuple */[
          String(readAndUpdateCounter(/* () */0)),
          e$1
        ];
}

function valueToUID(v) {
  var v$1;
  v$1 = v.tag ? /* Clo */Block.__(1, [
        lambdaToUID(v[0]),
        envToUID(v[1])
      ]) : /* VNum */Block.__(0, [/* tuple */[
          String(readAndUpdateCounter(/* () */0)),
          v[0]
        ]]);
  return /* tuple */[
          String(readAndUpdateCounter(/* () */0)),
          v$1
        ];
}

function bindingToUID(param) {
  return binding(/* tuple */[
              String(readAndUpdateCounter(/* () */0)),
              param.vid
            ], valueToUID(param.value));
}

function envToUID(e) {
  var bs = e ? /* Env */[
      bindingToUID(e[0]),
      envToUID(e[1])
    ] : /* Empty */0;
  return /* tuple */[
          String(readAndUpdateCounter(/* () */0)),
          bs
        ];
}

function ctxtToUID(c) {
  var c$1;
  switch (c.tag | 0) {
    case /* AppL */0 :
        c$1 = /* AppL */Block.__(0, [
            /* () */0,
            aexpToUID(c[1])
          ]);
        break;
    case /* AppR */1 :
        c$1 = /* AppR */Block.__(1, [
            valueToUID(c[0]),
            /* () */0
          ]);
        break;
    case /* LetL */2 :
        c$1 = /* LetL */Block.__(2, [
            /* tuple */[
              String(readAndUpdateCounter(/* () */0)),
              c[0]
            ],
            /* () */0,
            expToUID(c[2])
          ]);
        break;
    case /* AddL */3 :
        c$1 = /* AddL */Block.__(3, [
            /* () */0,
            aexpToUID(c[1])
          ]);
        break;
    case /* AddR */4 :
        c$1 = /* AddR */Block.__(4, [
            valueToUID(c[0]),
            /* () */0
          ]);
        break;
    
  }
  return /* tuple */[
          String(readAndUpdateCounter(/* () */0)),
          c$1
        ];
}

function ctxtsToUID(cs) {
  var cs$1 = cs ? /* Ctxt */[
      ctxtToUID(cs[0]),
      ctxtsToUID(cs[1])
    ] : /* Empty */0;
  return /* tuple */[
          String(readAndUpdateCounter(/* () */0)),
          cs$1
        ];
}

function focusToUID(f) {
  var f$1;
  switch (f.tag | 0) {
    case /* AExp */0 :
        f$1 = /* AExp */Block.__(0, [aexpToUID(f[0])]);
        break;
    case /* Exp */1 :
        f$1 = /* Exp */Block.__(1, [expToUID(f[0])]);
        break;
    case /* Value */2 :
        f$1 = /* Value */Block.__(2, [valueToUID(f[0])]);
        break;
    
  }
  return /* tuple */[
          String(readAndUpdateCounter(/* () */0)),
          f$1
        ];
}

function frameToUID(param) {
  return frame(ctxtsToUID(param.ctxts), envToUID(param.env));
}

function stackToUID(s) {
  var fs = s ? /* Stack */[
      frameToUID(s[0]),
      stackToUID(s[1])
    ] : /* Empty */0;
  return /* tuple */[
          String(readAndUpdateCounter(/* () */0)),
          fs
        ];
}

function configToUID(param) {
  return config(focusToUID(param.focus), frameToUID(param.frame), stackToUID(param.stack));
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
          focus: focusFromUID(param.focus_uid),
          frame: frameFromUID(param.frame),
          stack: stackFromUID(param.stack_uid)
        };
}

function inject(e) {
  var f = /* Exp */Block.__(1, [expToUID(e)]);
  return config(/* tuple */[
              String(readAndUpdateCounter(/* () */0)),
              f
            ], frame(/* tuple */[
                  String(readAndUpdateCounter(/* () */0)),
                  /* Empty */0
                ], /* tuple */[
                  String(readAndUpdateCounter(/* () */0)),
                  /* Empty */0
                ]), /* tuple */[
              String(readAndUpdateCounter(/* () */0)),
              /* Empty */0
            ]);
}

function isFinal(c) {
  switch (c.focus_uid[1].tag | 0) {
    case /* AExp */0 :
    case /* Exp */1 :
        return false;
    case /* Value */2 :
        if (c.frame.ctxts_uid[1] || c.stack_uid[1]) {
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
  var match = s.focus_uid[1];
  switch (match.tag | 0) {
    case /* AExp */0 :
    case /* Exp */1 :
        throw Pervasives.failwith("expected a value");
    case /* Value */2 :
        return valueFromUID(match[0]);
    
  }
}

var loading = inject(/* Lift */Block.__(0, [/* Var */Block.__(0, ["loading..."])]));

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
exports.frame = frame;
exports.stack_uid = stack_uid;
exports.config = config;
exports.lookup = lookup;
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
