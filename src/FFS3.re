/* strict lambda calc w/ environment + non-recursive let + arithmetic */
/* a translation of the (easier to read and reason about, but less executable and visualizable) Lean
   version */
/* Where's FFS2? Either skipped to avoid nameclashing with FFS2Viz or Lean version is FFS2 */

/* def vid : Type := string

   mutual inductive lambda, exp, val, binding, env
   with lambda : Type
   | intro : vid -> exp -> lambda
   with exp : Type /- why not add a val? b/c using sum allows us to match on whether the exp is a val or not -/
   | var  : vid -> exp
   | app  : exp -> exp -> exp /- TODO: instead of using sum here, just make an interstitial val type -/
   | lam  : lambda -> exp
   | elet :  vid -> exp -> exp -> exp
   | num : nat -> exp
   | add : exp -> exp -> exp
   with val : Type
   | vnum : nat -> val
   | clo : lambda -> env -> val
   with binding : Type
   | intro : vid -> val -> binding
   with env : Type
   | emp : env
   | bind : binding -> env -> env

   notation `∅` := unit.star

   inductive ctxt : Type
   | app_l  : unit -> exp -> ctxt
   | app_r  : val -> unit -> ctxt
   | elet_l : vid -> unit -> exp -> ctxt
   | add_l  : unit -> exp -> ctxt
   | add_r  : val -> unit -> ctxt */

type vid = string;

type lambda = {
  vid,
  exp,
}

and exp =
  | Var(vid)
  | App(exp, exp)
  | Lam(lambda)
  | Let(vid, exp, exp)
  | Num(int)
  | Add(exp, exp)

and value =
  | VNum(int)
  | Clo(lambda, env)

and binding = {
  vid,
  value,
}
and env = list(binding);

type hole = unit;

/* inductive ctxt : Type
   | app_l  : unit -> exp -> ctxt
   | app_r  : val -> unit -> ctxt
   | elet_l : vid -> unit -> exp -> ctxt
   | add_l  : unit -> exp -> ctxt
   | add_r  : val -> unit -> ctxt */

type ctxt =
  | AppL(hole, exp)
  | AppR(value, hole)
  | LetL(vid, hole, exp)
  | AddL(hole, exp)
  | AddR(value, hole);

type focus =
  | Exp(exp)
  | Value(value);

type frame = {
  maybeCtxt: option(ctxt),
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

let sorry = raise(failwith("TODO"));

/* TODO: should really be a monad, but OCaml/ReasonML lack good support at the moment. Janestreet
   thing is somewhat hacky, but official support is coming soon. */
let step = (c: config): option(config) =>
  switch (c) {
  /* var */
  /* | var {x env v c fs} (hl : lookup x env = option.some v) :
     small_step ⟨sum.inl (exp.var x), ⟨c, env⟩, fs⟩ ⟨sum.inr v, ⟨c, env⟩, fs⟩ */
  | {focus: Exp(Var(x)), frame: {maybeCtxt, env}, stack} =>
    switch (lookup(x, env)) {
    | Some(v) => Some({
                   focus: Value(v),
                   frame: {
                     maybeCtxt,
                     env,
                   },
                   stack,
                 })
    | None => None
    }
  /* lam */
  /* | var {x env v c fs} (hl : lookup x env = option.some v) :
     small_step ⟨sum.inl (exp.var x), ⟨c, env⟩, fs⟩ ⟨sum.inr v, ⟨c, env⟩, fs⟩ */
  | {focus: Exp(Lam(l)), frame: {maybeCtxt, env}, stack} =>
    Some({
      focus: Value(Clo(l, env)),
      frame: {
        maybeCtxt,
        env,
      },
      stack,
    })
  /* app */
  /* app_begin */
  /* | app_begin {f x c env fs} :
     small_step ⟨sum.inl (exp.app f x), ⟨c, env⟩, fs⟩
                ⟨sum.inl f, ⟨option.some (ctxt.app_l ∅ x), env⟩, ⟨c, env⟩ :: fs⟩ */
  | {focus: Exp(App(f, x)), frame: {maybeCtxt, env}, stack} =>
    Some({
      focus: Exp(f),
      frame: {
        maybeCtxt: Some(AppL((), x)),
        env,
      },
      stack: [{maybeCtxt, env}, ...stack],
    })
  /* app_l */
  /* | app_l {v x env c' env' fs} :
     small_step ⟨sum.inr v, ⟨option.some (ctxt.app_l ∅ x), env⟩, ⟨c', env'⟩ :: fs⟩
                ⟨sum.inl x, ⟨option.some (ctxt.app_r v ∅), env'⟩, ⟨c', env'⟩ :: fs⟩ */
  | {
      focus: Value(v),
      frame: {maybeCtxt: Some(AppL((), x)), env},
      stack: [{maybeCtxt: c', env: env'}, ...stack],
    } =>
    Some({
      focus: Exp(x),
      frame: {
        maybeCtxt: Some(AppR(v, ())),
        env: env',
      },
      stack: [{maybeCtxt: c', env: env'}, ...stack],
    })
  /* app_r */
  /* | app_r {v x e env env' fs} :
     small_step
       ⟨sum.inr v, ⟨option.some (ctxt.app_r (val.clo (lambda.intro x e) env) ∅), env'⟩, fs⟩
       ⟨sum.inl e, ⟨option.none, env.bind (binding.intro x v)⟩, fs⟩ */
  | {
      focus: Value(v),
      frame: {maybeCtxt: Some(AppR(Clo({vid: x, exp: e}, env), ())), env: env'},
      stack,
    } =>
    Some({
      focus: Exp(e),
      frame: {
        maybeCtxt: None,
        env: [{vid: x, value: v}, ...env],
      },
      stack,
    })
  /* app_exit */
  /* | app_exit {v env f fs} :
     small_step ⟨sum.inr v, ⟨option.none, env⟩, f :: fs⟩
                ⟨sum.inr v, f, fs⟩ */
  | {focus: Value(v), frame: {maybeCtxt: None, env}, stack: [f, ...stack]} =>
    Some({focus: Value(v), frame: f, stack})
  /* let */
  /* let_begin */
  /* | elet_begin {x e₁ e₂ c env fs} :
      small_step ⟨sum.inl (exp.elet x e₁ e₂), ⟨c, env⟩, fs⟩
                 ⟨sum.inl e₁, ⟨option.some (ctxt.elet_l x ∅ e₂), env⟩, ⟨c, env⟩ :: fs⟩
     */
  | {focus: Exp(Let(x, e1, e2)), frame: {maybeCtxt, env}, stack} =>
    Some({
      focus: Exp(e1),
      frame: {
        maybeCtxt: Some(LetL(x, (), e2)),
        env,
      },
      stack: [{maybeCtxt, env}, ...stack],
    })
  /* let_l */
  /* | elet_l {v x e₂ env c' env' fs} :
     small_step ⟨sum.inr v, ⟨option.some (ctxt.elet_l x ∅ e₂), env⟩, ⟨c', env'⟩ :: fs⟩
                ⟨sum.inl e₂, ⟨c', env'.bind (binding.intro x v)⟩, fs⟩ */
  | {
      focus: Value(v),
      frame: {maybeCtxt: Some(LetL(x, (), e2)), env},
      stack: [{maybeCtxt: c', env: env'}, ...stack],
    } =>
    Some({
      focus: Exp(e2),
      frame: {
        maybeCtxt: c',
        env: [{vid: x, value: v}, ...env'],
      },
      stack,
    })
  /* num */
  /* | num {n f fs} :
     small_step ⟨sum.inl (exp.num n), f, fs⟩ ⟨sum.inr (val.vnum n), f, fs⟩ */
  | {focus: Exp(Num(n)), frame, stack} => Some({focus: Value(VNum(n)), frame, stack})
  /* add */
  /* add_begin */
  /* | add_begin {x y c env fs} :
     small_step ⟨sum.inl (exp.add x y), ⟨c, env⟩, fs⟩
                ⟨sum.inl x, ⟨option.some (ctxt.add_l ∅ y), env⟩, ⟨c, env⟩ :: fs⟩ */
  | {focus: Exp(Add(x, y)), frame: {maybeCtxt, env}, stack} =>
    Some({
      focus: Exp(x),
      frame: {
        maybeCtxt: Some(AddL((), y)),
        env,
      },
      stack: [{maybeCtxt, env}, ...stack],
    })
  /* add_l */
  /* | add_l {v y env c' env' fs} :
     small_step ⟨sum.inr v, ⟨option.some (ctxt.add_l ∅ y), env⟩, ⟨c', env'⟩ :: fs⟩
                ⟨sum.inl y, ⟨option.some (ctxt.add_r v ∅), env'⟩, ⟨c', env'⟩ :: fs⟩ */
  | {
      focus: Value(v),
      frame: {maybeCtxt: Some(AddL((), y)), env},
      stack: [{maybeCtxt: c', env: env'}, ...stack],
    } =>
    Some({
      focus: Exp(y),
      frame: {
        maybeCtxt: Some(AddR(v, ())),
        env: env',
      },
      stack: [{maybeCtxt: c', env: env'}, ...stack],
    })
  /* add_r */
  /* | add_r {x y z env c' env' fs} (hz : z = x + y) :
     small_step ⟨sum.inr (val.vnum y), ⟨option.some (ctxt.add_r (val.vnum x) ∅), env⟩, f :: fs⟩
                ⟨sum.inr (val.vnum z), f, fs⟩ */
  | {
      focus: Value(VNum(y)),
      frame: {maybeCtxt: Some(AddR(VNum(x), ())), env},
      stack: [frame, ...stack],
    } =>
    Some({focus: Value(VNum(x + y)), frame, stack})
  | _ => None
  };

/* def inject (e : exp) : state := ⟨sum.inl e, ⟨option.none, env.emp⟩, []⟩ */
let inject = (e: exp): config => {
  focus: Exp(e),
  frame: {
    maybeCtxt: None,
    env: [],
  },
  stack: [],
};

/* def is_final : state -> Prop
   | ⟨sum.inr v, ⟨option.none, env⟩, []⟩ := true
   | _ := false */

let isFinal = (c: config): bool =>
  switch (c) {
  | {focus: Value(_), frame: {maybeCtxt: None, env: _}, stack: []} => true
  | _ => false
  };

let rec iterateMaybeAux = (f, x) =>
  switch (x) {
  | None => []
  | Some(x) =>
    let fx = f(x);
    [x, ...iterateMaybeAux(f, fx)];
  };

/* let advance = ms =>
   switch (step(ms)) {
   | None => None
   | Some((ms, _)) => Some(ms)
   }; */

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

let iterateMaybe = (f, x) => iterateMaybeAux(f, Some(x));

let interpretTrace = p =>
  takeWhileInclusive(c => !isFinal(c), iterateMaybe(advance, inject(p)));

let loading: config = inject(Var("loading..."));