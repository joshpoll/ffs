/*
 Based on
 http://siek.blogspot.com/2009/12/ecd-abstract-machine-programmers.html
 but fleshed out and simplified.

 The FFS machine.
 */

/* TODO: these rules aren't actually correct! Debug with Theia. */
/* TODO: make a pair where the second piece is a string describing the change. then try to formalize
   those changes */

type id = string;

type expr =
  | Var(id)
  | App(expr, expr)
  | Lam(lambda)
  | Val(value)

and value =
  | Clo(lambda, env)

and binding = {
  id,
  value,
}

and env = list(binding)

and lambda = {
  id,
  expr,
};

type hole = unit;

type ctxt =
  | AppL(hole, expr)
  | AppR(value, hole);

type ctxts = list(ctxt);

type frame = {
  ctxts,
  env,
};

type machineState = {
  focus: expr,
  frame,
  stack: list(frame),
};

let rec lookup = (x, env) =>
  switch (env) {
  | [] => None
  | [{id: k, value: v}, ..._] when x == k => Some(v)
  | [_, ...t] => lookup(x, t)
  };

/* seems like this is just duplicating the rules since they don't carry any extra info here? might
   be different for different abstract machines. however, it does make diffing easy b/c we know what
   rule was applied so we can unambiguously compute the diff */
type deltaOpCodes =
  | LOOKUP
  | LAM2CLO
  | PUSHENTER
  | EVALF
  | EVALX
  | PREPE
  | POP;

type delta = (string, deltaOpCodes);

let step =
    ({focus, frame: {ctxts, env} as frame, stack}: machineState)
    : option((machineState, delta)) =>
  switch (focus) {
  | Var(x) =>
    switch (lookup(x, env)) {
    | None => None
    | Some(v) => Some(({focus: Val(v), frame, stack}, ("lookup x in env", LOOKUP)))
    }
  | Lam(lam) =>
    Some((
      {focus: Val(Clo(lam, env)), frame, stack},
      ("copy `env` and move `lam` to make `clo`", LAM2CLO),
    ))
  | App(Val(Clo({id: x, expr: e'}, env')), Val(v)) =>
    Some((
      {
        focus: e',
        frame: {
          ctxts,
          env: [{id: x, value: v}, ...env'],
        },
        stack: [frame, ...stack],
      },
      (
        "copy `frame` to `stack`. move `x` to `env`. move `v` to `env`. move `e'` to focus",
        PUSHENTER,
      ) /*
      alternatively, x and v make a binding which is added to env. also clo is deleted */
    ))
  | App(f, x) =>
    Some((
      {
        focus: f,
        frame: {
          ctxts: [AppL((), x), ...ctxts],
          env,
        },
        stack,
      },
      ("move f to focus. mutate App to AppL. move x to AppL?", EVALF),
    ))
  | Val(v) =>
    switch (ctxts) {
    | [] =>
      switch (stack) {
      | [] => None
      | [frame, ...stack] => Some(({focus, frame, stack}, ("move frame to frame", POP)))
      }
    | [AppL((), x), ...ctxts] =>
      Some((
        {
          focus: x,
          frame: {
            ctxts: [AppR(v, ()), ...ctxts],
            env,
          },
          stack,
        },
        ("mutate AppL to AppR. move x to focus. move v to AppR.", EVALX),
      ))
    | [AppR(v_f, ()), ...ctxts] =>
      Some((
        {
          focus: App(Val(v_f), Val(v)),
          frame: {
            ctxts,
            env,
          },
          stack,
        },
        ("mutate AppR to App. move v_f into Val. move v into Val", PREPE),
      ))
    }
  };

let rec takeWhileInclusive = (p, l) =>
  switch (l) {
  | [] => []
  | [x, ...xs] => [
      x,
      ...if (p(x)) {
           takeWhileInclusive(p, xs);
         } else {
           [];
         },
    ]
  };

let empty = {
  focus: Var("x"), /* TODO: should be Empty */
  frame: {
    ctxts: [],
    env: [],
  },
  stack: [],
};

let inject = p => {
  focus: p,
  frame: {
    ctxts: [],
    env: [],
  },
  stack: [],
};

let isFinal = ms =>
  switch (ms) {
  | _ => false
  };

let rec iterateMaybeAux = (f, x) =>
  switch (x) {
  | None => []
  | Some(x) =>
    let fx = f(x);
    [x, ...iterateMaybeAux(f, fx)];
  };

let advance = ms =>
  switch (step(ms)) {
  | None => None
  | Some((ms, _)) => Some(ms)
  };

let iterateMaybe = (f, x) => iterateMaybeAux(f, Some(x));

let interpretTrace = p =>
  takeWhileInclusive(c => !isFinal(c), iterateMaybe(advance, inject(p)));