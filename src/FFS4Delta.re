/* Like FFS4, but includes delta information */

/* design requirements for delta

   - only attached to metavariables in SOS rules
   - external functions only present in the numerator. unsure how they should specify their changes
   - mvars on the left may disappear, but mvar on the right always come from the left
      - this means our transitions must always be specified left-to-right
      - so we can specify it as a map from UIDs on the left to a set of UIDs on the right. This will
      have some redundancies. What's unclear is how to deal with multiple positions that are
      unchanged.
      - for now let's assume rules are left-linear. This is wrong even for our simple example (c.f.
      variable lookup), but we can work around that for now and scale the approach later.

    */

/* def vid : Type := string

   mutual inductive lambda, aexp, exp, val, binding, env
   with lambda : Type
   | intro : vid -> exp -> lambda
   with aexp : Type /- callee-saved: restores frames when returning -/
   | var  : vid -> aexp
   | app  : aexp -> aexp -> aexp
   | lam  : lambda -> aexp
   | num : nat -> aexp
   | add : aexp -> aexp -> aexp
   | bracket : exp -> aexp /- adds new block scope. syntactically looks like {} or () -/
   with exp : Type /- caller-saved: doesn't make any guarantees about frames when returning -/
   | lift : aexp -> exp /- "hack" that allows exp to extend aexp -/
   | elet :  vid -> aexp -> exp -> exp
   with val : Type
   | vnum : nat -> val
   | clo : lambda -> env -> val
   with binding : Type
   | intro : vid -> val -> binding
   with env : Type
   | emp : env
   | bind : binding -> env -> env

   notation `∅` := unit.star

   instance aexp_coe : has_coe aexp exp := { coe := exp.lift }

   inductive ctxt : Type
   | app_l  : unit -> exp -> ctxt
   | app_r  : val -> unit -> ctxt
   | elet_l : vid -> unit -> exp -> ctxt
   | add_l  : unit -> aexp -> ctxt
   | add_r  : val -> unit -> ctxt

   -- def ctxts : Type := list ctxt

   /- structure zipper : Type :=
   (focus : sum exp val)
   (rest : ctxts) -/

   structure frame : Type :=
   (ctxts : list ctxt)
   (env : env)

   inductive focus : Type
   | aexp : aexp -> focus
   | exp  : exp -> focus
   | val  : val -> focus

   structure state : Type :=
   /- (focus : exp)
   (frame : frame)
   (stack : list ffs.frame) -/
   /- (instr : zipper)
   (env : env)
   (stack : list frame) -/
   (focus : focus) /- f -/
   (frame : frame)       /- f -/
   (stack : list ffs2.frame)  /- s -/ */

type vid = string;

type lambda = {
  vid,
  exp,
}

and aexp =
  | Var(vid)
  | App(aexp, aexp)
  | Lam(lambda)
  | Num(int)
  | Add(aexp, aexp)
  | Bracket(exp)

and exp =
  | Lift(aexp)
  | Let(vid, aexp, exp)

and value =
  | VNum(int)
  | Clo(lambda, env)

and binding = {
  vid,
  value,
}
and env = list(binding);

type hole = unit;

type ctxt =
  | AppL(hole, aexp)
  | AppR(value, hole)
  | LetL(vid, hole, exp)
  | AddL(hole, aexp)
  | AddR(value, hole);

type focus =
  | AExp(aexp)
  | Exp(exp)
  | Value(value);

type frame = {
  ctxts: list(ctxt),
  env,
};

type config = {
  focus,
  frame,
  stack: list(frame),
};

/* def lookup (x : vid) : env -> option val
   | env.emp := option.none
   | (env.bind (binding.intro y val) env) :=
       if x = y then option.some val
                else lookup env */

let rec lookup = (x: vid, env: env): option(value) =>
  switch (env) {
  | [] => None
  | [{vid: y, value: v}, ...env] =>
    if (x == y) {
      Some(v);
    } else {
      lookup(x, env);
    }
  };

// let sorry = raise(failwith("TODO"));

/* TODO: should really be a monad, but OCaml/ReasonML lack good support at the moment. Janestreet
   thing is somewhat hacky, but official support is coming soon. */
let step = (c: config): option((config, string)) =>
  switch (c) {
  /* var */
  /*
    | var {x env v c fs} (hl : lookup x env = option.some v) :
      small_step ⟨focus.aexp (aexp.var x), ⟨c, env⟩, fs⟩ ⟨focus.val v, ⟨c, env⟩, fs⟩
   */
  | {focus: AExp(Var(x)), frame: {ctxts, env}, stack} =>
    switch (lookup(x, env)) {
    | Some(v) => Some(({
                         focus: Value(v),
                         frame: {
                           ctxts,
                           env,
                         },
                         stack,
                       }, "var"))
    | None => None
    }
  /* lam */
  /*
    | lam {l c env fs} :
    small_step ⟨focus.aexp (aexp.lam l), ⟨c, env⟩, fs⟩ ⟨focus.val (val.clo l env), ⟨c, env⟩, fs⟩
   */
  | {focus: AExp(Lam(l)), frame: {ctxts, env}, stack} =>
    Some(({
            focus: Value(Clo(l, env)),
            frame: {
              ctxts,
              env,
            },
            stack,
          }, "lam"))
  /* app */
  /* app_begin */
  /*
    | app_begin {f x c env fs} :
    small_step ⟨focus.aexp (aexp.app f x), ⟨c, env⟩, fs⟩
               ⟨focus.aexp f, ⟨(ctxt.app_l ∅ x) :: c, env⟩, fs⟩
   */
  | {focus: AExp(App(f, x)), frame: {ctxts, env}, stack} =>
    Some((
      {
        focus: AExp(f),
        frame: {
          ctxts: [AppL((), x), ...ctxts],
          env,
        },
        stack,
      },
      "app_begin",
    ))
  /* app_l */
  /*
    | app_l {v x c env fs} :
    small_step ⟨focus.val v, ⟨(ctxt.app_l ∅ x) :: c, env⟩, fs⟩
               ⟨focus.aexp x, ⟨(ctxt.app_r v ∅) :: c, env⟩, fs⟩
   */
  | {focus: Value(v), frame: {ctxts: [AppL((), x), ...c], env}, stack} =>
    Some(({
            focus: AExp(x),
            frame: {
              ctxts: [AppR(v, ()), ...c],
              env,
            },
            stack,
          }, "app_l"))
  /* app_r */
  /*
    | app_r {v x e env c env' fs} :
    small_step
      ⟨focus.val v, ⟨(ctxt.app_r (val.clo (lambda.intro x e) env) ∅) :: c, env'⟩, fs⟩
      ⟨focus.exp e, ⟨[], env.bind (binding.intro x v)⟩, ⟨c, env'⟩ :: fs⟩ /- save frame -/
   */
  | {
      focus: Value(v),
      frame: {ctxts: [AppR(Clo({vid: x, exp: e}, env), ()), ...ctxts], env: env'},
      stack,
    } =>
    Some((
      {
        focus: Exp(e),
        frame: {
          ctxts: [],
          env: [{vid: x, value: v}, ...env],
        },
        stack: [{ctxts, env: env'}, ...stack],
      },
      "app_r",
    ))
  /* app_exit */
  /*
    | app_exit {v env f fs} :
    small_step ⟨focus.val v, ⟨[], env⟩, f :: fs⟩ /- restores frame -/
               ⟨focus.val v, f, fs⟩
   */
  | {focus: Value(v), frame: {ctxts: [], env}, stack: [frame, ...stack]} =>
    Some(({focus: Value(v), frame, stack}, "app_exit"))
  /* let */
  /* let_begin */
  /*
    | elet_begin {x e₁ e₂ c env fs} :
    small_step ⟨focus.exp (exp.elet x e₁ e₂), ⟨c, env⟩, fs⟩
               ⟨focus.aexp e₁, ⟨(ctxt.elet_l x ∅ e₂) :: c, env⟩, fs⟩ /- modifies frame -/
   */
  | {focus: Exp(Let(x, ae1, e2)), frame: {ctxts, env}, stack} =>
    Some((
      {
        focus: AExp(ae1),
        frame: {
          ctxts: [LetL(x, (), e2), ...ctxts],
          env,
        },
        stack,
      },
      "let_begin",
    ))
  /* let_l */
  /*
    | elet_l {v x e₂ c env fs} :
    small_step ⟨focus.val v, ⟨(ctxt.elet_l x ∅ e₂) :: c, env⟩, fs⟩ /- modifies frame -/
               ⟨focus.exp e₂, ⟨c, env.bind (binding.intro x v)⟩, fs⟩
   */
  | {focus: Value(v), frame: {ctxts: [LetL(x, (), e2), ...ctxts], env}, stack} =>
    Some((
      {
        focus: Exp(e2),
        frame: {
          ctxts,
          env: [{vid: x, value: v}, ...env],
        },
        stack,
      },
      "let_l",
    ))
  /* num */
  /*
    | num {n f fs} :
    small_step ⟨focus.aexp (aexp.num n), f, fs⟩ ⟨focus.val (val.vnum n), f, fs⟩
   */
  | {focus: AExp(Num(n)), frame, stack} =>
    Some(({focus: Value(VNum(n)), frame, stack}, "num"))
  /* add */
  /* add_begin */
  /*
    | add_begin {x y c env fs} :
    small_step ⟨focus.aexp (aexp.add x y), ⟨c, env⟩, fs⟩
               ⟨focus.aexp x, ⟨(ctxt.add_l ∅ y) :: c, env⟩, fs⟩
   */
  | {focus: AExp(Add(x, y)), frame: {ctxts, env}, stack} =>
    Some((
      {
        focus: AExp(x),
        frame: {
          ctxts: [AddL((), y), ...ctxts],
          env,
        },
        stack,
      },
      "add_begin",
    ))
  /* add_l */
  /*
    | add_l {v y c env fs} :
    small_step ⟨focus.val v, ⟨(ctxt.add_l ∅ y) :: c, env⟩, fs⟩
               ⟨focus.aexp y, ⟨(ctxt.add_r v ∅) :: c, env⟩, fs⟩
   */
  | {focus: Value(v), frame: {ctxts: [AddL((), y), ...ctxts], env}, stack} =>
    Some(({
            focus: AExp(y),
            frame: {
              ctxts: [AddR(v, ()), ...ctxts],
              env,
            },
            stack,
          }, "add_l"))
  /* add_r */
  /*
    | add_r {x y z c env fs} (hz : z = x + y) :
    small_step ⟨focus.val (val.vnum y), ⟨(ctxt.add_r (val.vnum x) ∅) :: c, env⟩, fs⟩
               ⟨focus.val (val.vnum z), ⟨c, env⟩, fs⟩
   */
  | {focus: Value(VNum(y)), frame: {ctxts: [AddR(VNum(x), ()), ...ctxts], env}, stack} =>
    Some(({
            focus: Value(VNum(x + y)),
            frame: {
              ctxts,
              env,
            },
            stack,
          }, "add_r"))
  /* bracket */
  /*
    | bracket {e c env fs} :
    small_step ⟨focus.aexp (aexp.bracket e), ⟨c, env⟩, fs⟩
               ⟨focus.exp e, ⟨[], env⟩, ⟨c, env⟩ :: fs⟩
   */
  | {focus: AExp(Bracket(e)), frame: {ctxts, env}, stack} =>
    Some((
      {
        focus: Exp(e),
        frame: {
          ctxts: [],
          env,
        },
        stack: [{ctxts, env}, ...stack],
      },
      "bracket",
    ))
  /* lift */
  /*
    | lift {a f fs} :
    small_step ⟨focus.exp (exp.lift a), f, fs⟩
               ⟨focus.aexp a, f, fs⟩
   */
  | {focus: Exp(Lift(a)), frame, stack} => Some(({focus: AExp(a), frame, stack}, "lift"))
  // | {focus, frame, stack} => Some({focus: sorry, frame: sorry, stack: sorry})
  | _ => None
  };

/* def inject (e : exp) : state := ⟨sum.inl e, ⟨option.none, env.emp⟩, []⟩ */
let inject = (e: exp): config => {
  focus: Exp(e),
  frame: {
    ctxts: [],
    env: [],
  },
  stack: [],
};

/* def is_final : state -> Prop
   | ⟨sum.inr v, ⟨option.none, env⟩, []⟩ := true
   | _ := false */

let isFinal = (c: config): bool =>
  switch (c) {
  | {focus: Value(_), frame: {ctxts: [], env: _}, stack: []} => true
  | _ => false
  };

let rec iterateMaybeAux = (f, x) =>
  switch (x) {
  | None => []
  | Some(x) =>
    let fx = f(x);
    [x, ...iterateMaybeAux(f, fx)];
  };

let advance = step;

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

let iterateMaybe = (f: 'a => option('a), x: 'a): list('a) => iterateMaybeAux(f, Some(x));

let rec iterateMaybeSideEffect = (f: 'a => option(('a, 'b)), x: 'a): (list('a), list('b)) =>
  switch (f(x)) {
  | None => ([x], [])
  | Some((a, b)) =>
    let (als, bls) = iterateMaybeSideEffect(f, a);
    ([x, ...als], [b, ...bls]);
  };

let interpretTrace = p => {
  let (states, rules) = iterateMaybeSideEffect(step, inject(p));
  Js.log2("rules", rules |> Array.of_list);
  takeWhileInclusive(c => !isFinal(c), states);
};

let interpret = p => {
  let s = interpretTrace(p) |> List.rev |> List.hd;
  switch (s) {
  | {focus: Value(v), frame: _, stack: _} => v
  | _ => raise(failwith("expected a value"))
  };
};

let loading: config = inject(Lift(Var("loading...")));