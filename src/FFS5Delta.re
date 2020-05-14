/* FFS5.lean translated */

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
      - if the mvar only appears in the conclusion, then it must have come from an external rule,
      which will be considered a mutation of its inputs
      - everything else without annotations is created and destroyed
    - the "flow" implementation is considered an unfinished sketch that gets the job done
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

    structure frame : Type :=
    (ctxts : list ctxt)
    (env : env)

    inductive focus : Type
    | aexp : aexp -> focus
    | exp  : exp -> focus
    | val  : val -> focus

    structure zipper : Type :=
    (focus: focus)
    (ctxts: list ctxt)

    structure state : Type :=
    (zipper: zipper)
    (env : env)
    (stack : list frame) */

type uid = string; /* only unique within a structure, not across them */
let counter = ref(0);

let readAndUpdateCounter = () => {
  counter := counter^ + 1;
  counter^ - 1;
};

let rauc = () => readAndUpdateCounter() |> string_of_int;

type vid = (uid, string);

let vid = x => (rauc(), x);

type int_uid = (uid, int);

let int_uid = n => (rauc(), n);

type lambda = {
  uid,
  vid,
  exp_uid,
}

and aexp_uid = (uid, aexp)

and aexp =
  | Var(vid)
  | App(aexp_uid, aexp_uid)
  | Lam(lambda)
  | Num(int_uid)
  | Add(aexp_uid, aexp_uid)
  | Bracket(exp_uid)

and exp_uid = (uid, exp)

and exp =
  | Lift(aexp_uid)
  | Let(vid, aexp_uid, exp_uid)

and value_uid = (uid, value)

and value =
  | VNum(int_uid)
  | Clo(lambda, env_uid)

and binding = {
  uid,
  vid,
  value_uid,
}

and env =
  | Empty
  | Env(binding, env_uid)

and env_uid = (uid, env);

/* lambda */
let lambda = (~vid, ~exp_uid) => {uid: rauc(), vid, exp_uid};

/* aexp */
let aexp_uid = (ae): aexp_uid => (rauc(), ae);
/* let var = vid => Var(rauc(), vid);
   let app = (f, x) => App(rauc(), f, x);
   let lam = l => Lam(rauc(), l);
   let num = n => Num(rauc(), n);
   let add = (x, y) => Add(rauc(), x, y);
   let bracket = e => Bracket(rauc(), e); */

/* exp */
let exp_uid = (e): exp_uid => (rauc(), e);
/* let lift = ae => Lift(rauc(), ae);
   let elet = (x, ae1, e2) => Let(rauc(), x, ae1, e2); */

/* value */
let value_uid = (v): value_uid => (rauc(), v);
/* let vnum = n => VNum(rauc(), n);
   let clo = (l, e) => Clo(rauc(), l, e); */

/* binding */
let binding = (~vid, ~value_uid) => {uid: rauc(), vid, value_uid};

/* env */
let env_uid = (bs): env_uid => (rauc(), bs);

type hole = unit;

type ctxt =
  | AppL(hole, aexp_uid)
  | AppR(value_uid, hole)
  | LetL(vid, hole, exp_uid)
  | AddL(hole, aexp_uid)
  | AddR(value_uid, hole);

type ctxt_uid = (uid, ctxt);

let ctxt_uid = (c): ctxt_uid => (rauc(), c);

/* let appL = ((), ae) => AppL(rauc(), (), ae);
   let appR = (v, ()) => AppR(rauc(), v, ());
   let letL = (v, (), e) => LetL(rauc(), v, (), e);
   let addL = ((), ae) => AddL(rauc(), (), ae);
   let appR = (v, ()) => AddR(rauc(), v, ()); */

type focus =
  | AExp(aexp_uid)
  | Exp(exp_uid)
  | Value(value_uid);

type focus_uid = (uid, focus);

let focus_uid = (f): focus_uid => (rauc(), f);

/* let aexp = ae => AExp(rauc(), ae);
   let exp = e => Exp(rauc(), e);
   let value = v => Value(rauc(), v); */

// type ctxts = (uid, list(ctxt_uid));

type ctxts =
  | Empty
  | Ctxt(ctxt_uid, ctxts_uid)

and ctxts_uid = (uid, ctxts);

let ctxts_uid = (cs): ctxts_uid => (rauc(), cs);

type zipper = {
  uid,
  focus_uid,
  ctxts_uid,
};

let zipper = (~focus_uid, ~ctxts_uid) => {uid: rauc(), focus_uid, ctxts_uid};

type frame = {
  uid,
  ctxts_uid,
  env_uid,
};

let frame = (~ctxts_uid, ~env_uid) => {uid: rauc(), ctxts_uid, env_uid};

type stack =
  | Empty
  | Stack(frame, stack_uid)

and stack_uid = (uid, stack);

let stack_uid = (fs): stack_uid => (rauc(), fs);

type config = {
  uid,
  zipper,
  env_uid,
  stack_uid,
};

let config = (~zipper, ~env_uid, ~stack_uid) => {uid: rauc(), zipper, env_uid, stack_uid};

/* TODO: pick a name for this*/
/* TODO: !!!add mutation flag?!!! */
/* type flow = {
     left: uid,
     right: list(uid),
   };

   /* TODO: name */
   type ribbon = list(flow); */

module MS = Belt.Map.String;
type flow = MS.t(list(uid));

/* def lookup (x : vid) : env -> option val
   | env.emp := option.none
   | (env.bind (binding.intro y val) env) :=
       if x = y then option.some val
                else lookup env */

/* computes ribbon, too, but not an overapproximation of the ribbon that suggests more state
   involved than there really is. TODO: refine ribbon? */
let rec lookup = (x: vid, env: env_uid): option((value_uid, flow)) => {
  let (x_uid, x_val) = x;
  let (env_uid, env_val) = env;
  switch (env_val) {
  | Empty => None
  | Env({vid: y, value_uid: (v_uid, v_val)}, (_, env_val)) =>
    let (y_uid, y_val) = y;
    if (x_val == y_val) {
      let fresh = rauc();
      Some(((fresh, v_val), MS.fromArray([|(x_uid, [fresh]), (env_uid, [fresh])|])));
    } else {
      lookup(x, (env_uid, env_val));
    };
  };
};

// let sorry = raise(failwith("TODO"));

let mapUnion = (m1: MS.t('a), m2: MS.t('a)) => {
  MS.reduce(m2, m1, (m, k, v) => m->MS.set(k, v));
};

/* TODO: should really be a monad, but OCaml/ReasonML lack good support at the moment. Janestreet
   thing is somewhat hacky, but official support is coming soon. */
let step = (c: config): option((config, (string, flow))) =>
  switch (c) {
  /* var */
  /*
    | var {x env v c fs} (hl : lookup x env = option.some v) :
    small_step ⟨⟨focus.aexp (aexp.var x), c⟩, env, fs⟩ ⟨⟨focus.val v, c⟩, env, fs⟩
   */
  | {
      zipper: {focus_uid: (_, AExp((_, Var(x)))), ctxts_uid: (ctxts_uid, ctxts_val)},
      env_uid: (env_uid, env_val),
      stack_uid: (stack_uid, stack_val),
    } =>
    switch (lookup(x, (env_uid, env_val))) {
    | Some(((v_uid, v_val), lookup_ribbon)) =>
      Some((
        config(
          ~zipper=
            zipper(
              ~focus_uid=focus_uid(Value((v_uid, v_val))),
              ~ctxts_uid=(ctxts_uid, ctxts_val),
            ),
          ~env_uid=(env_uid, env_val),
          ~stack_uid=(stack_uid, stack_val),
        ),
        (
          "var",
          mapUnion(
            MS.fromArray([|
              (ctxts_uid, [ctxts_uid]),
              (env_uid, [env_uid]),
              (stack_uid, [stack_uid]),
            |]),
            lookup_ribbon,
          ),
        ),
      ))
    | None => None
    }
  /* lam */
  /*
    | lam {l c env fs} :
    small_step ⟨⟨focus.aexp (aexp.lam l), c⟩, env, fs⟩ ⟨⟨focus.val (val.clo l env), c⟩, env, fs⟩
   */
  | {
      zipper: {
        focus_uid: (_, AExp((_, Lam({uid: l_uid} as l)))),
        ctxts_uid: (ctxts_uid, ctxts_val),
      },
      env_uid: (env_uid, env_val),
      stack_uid: (stack_uid, stack_val),
    } =>
    let env_uid2 = rauc();
    Some((
      config(
        ~zipper=
          zipper(
            ~focus_uid=(rauc(), Value((rauc(), Clo(l, (env_uid2, env_val))))),
            ~ctxts_uid=(ctxts_uid, ctxts_val),
          ),
        ~env_uid=(env_uid, env_val),
        ~stack_uid=(stack_uid, stack_val),
      ),
      (
        "lam",
        MS.fromArray([|
          (l_uid, [l_uid]),
          (ctxts_uid, [ctxts_uid]),
          (env_uid, [env_uid, env_uid2]),
          (stack_uid, [stack_uid]),
        |]),
      ),
    ));
  /* app */
  /* app_begin */
  /*
    | app_begin {f x c env fs} :
    small_step ⟨⟨focus.aexp (aexp.app f x), c⟩, env, fs⟩
               ⟨⟨focus.aexp f, (ctxt.app_l ∅ x) :: c⟩, env, fs⟩
   */
  | {zipper: {focus_uid: (_, AExp((_, App(f, x)))), ctxts_uid: c}, env_uid: env, stack_uid: s} =>
    let (f_uid, f_val) = f;
    let (x_uid, x_val) = x;
    let (c_uid, c_val) = c;
    let (env_uid, env_val) = env;
    let (s_uid, s_val) = s;
    Some((
      config(
        ~zipper=
          zipper(
            ~focus_uid=focus_uid(AExp(f)),
            ~ctxts_uid=ctxts_uid(Ctxt((rauc(), AppL((), x)), c)),
          ),
        ~env_uid=env,
        ~stack_uid=s,
      ),
      (
        "app_begin",
        MS.fromArray([|
          (f_uid, [f_uid]),
          (x_uid, [x_uid]),
          (c_uid, [c_uid]),
          (env_uid, [env_uid]),
          (s_uid, [s_uid]),
        |]),
      ),
    ));
  /* app_l */
  /*
    | app_l {v x c env fs} :
    small_step ⟨⟨focus.val v, (ctxt.app_l ∅ x) :: c⟩, env, fs⟩
               ⟨⟨focus.aexp x, (ctxt.app_r v ∅) :: c⟩, env, fs⟩
   */
  | {
      zipper: {focus_uid: (_, Value(v)), ctxts_uid: (_, Ctxt((_, AppL((), x)), c))},
      env_uid: env,
      stack_uid: s,
    } =>
    let (v_uid, v_val) = v;
    let (x_uid, x_val) = x;
    let (c_uid, c_val) = c;
    let (env_uid, env_val) = env;
    let (s_uid, s_val) = s;
    Some((
      config(
        ~zipper=
          zipper(
            ~focus_uid=focus_uid(AExp(x)),
            ~ctxts_uid=ctxts_uid(Ctxt((rauc(), AppR(v, ())), c)),
          ),
        ~env_uid=env,
        ~stack_uid=s,
      ),
      (
        "app_l",
        MS.fromArray([|
          (v_uid, [v_uid]),
          (x_uid, [x_uid]),
          (c_uid, [c_uid]),
          (env_uid, [env_uid]),
          (s_uid, [s_uid]),
        |]),
      ),
    ));
  /* app_r */
  /*
    | app_r {v x e env c env' fs} :
    small_step
      ⟨⟨focus.val v, (ctxt.app_r (val.clo (lambda.intro x e) env) ∅) :: c⟩, env', fs⟩
      ⟨⟨focus.exp e, []⟩, env.bind (binding.intro x v), ⟨c, env'⟩ :: fs⟩ /- save frame -/
   */
  | {
      zipper: {
        focus_uid: (_, Value(v)),
        ctxts_uid: (_, Ctxt((_, AppR((_, Clo({vid: x, exp_uid: e}, env)), ())), c)),
      },
      env_uid: env2,
      stack_uid: s,
    } =>
    let (v_uid, v_val) = v;
    let (x_uid, x_val) = x;
    let (e_uid, e_val) = e;
    let (en_uid, en_val) = env;
    let (c_uid, c_val) = c;
    let (en2_uid, en2_val) = env2;
    let (s_uid, s_val) = s;
    Some((
      config(
        ~zipper=zipper(~focus_uid=focus_uid(Exp(e)), ~ctxts_uid=ctxts_uid(Empty)),
        ~env_uid=env_uid(Env(binding(~vid=x, ~value_uid=v), env)),
        ~stack_uid=stack_uid(Stack(frame(~ctxts_uid=c, ~env_uid=env2), s)),
      ),
      (
        "app_r",
        MS.fromArray([|
          (v_uid, [v_uid]),
          (x_uid, [x_uid]),
          (e_uid, [e_uid]),
          (en_uid, [en_uid]),
          (c_uid, [c_uid]),
          (en2_uid, [en2_uid]),
          (s_uid, [s_uid]),
        |]),
      ),
    ));
  /* app_exit */
  /*
    | app_exit {v env c' env' fs} :
    small_step ⟨⟨focus.val v, []⟩, env, ⟨c', env'⟩ :: fs⟩ /- restores frame -/
               ⟨⟨focus.val v, c'⟩, env', fs⟩
   */
  | {
      zipper: {focus_uid: (_, Value(v)), ctxts_uid: (_, Empty)},
      env_uid: env,
      stack_uid: (_, Stack({ctxts_uid: c, env_uid: env2}, s)),
    } =>
    let (v_uid, _) = v;
    let (en_uid, _) = env;
    let (c_uid, _) = c;
    let (en2_uid, _) = env2;
    let (s_uid, _) = s;
    Some((
      config(
        ~zipper=zipper(~focus_uid=focus_uid(Value(v)), ~ctxts_uid=c),
        ~env_uid=env2,
        ~stack_uid=s,
      ),
      (
        "app_exit",
        MS.fromArray([|
          (v_uid, [v_uid]),
          (en_uid, []),
          (c_uid, [c_uid]),
          (en2_uid, [en2_uid]),
          (s_uid, [s_uid]),
        |]),
      ),
    ));
  /* let */
  /* let_begin */
  /*
    | elet_begin {x e₁ e₂ c env fs} :
    small_step ⟨⟨focus.exp (exp.elet x e₁ e₂), c⟩, env, fs⟩
               ⟨⟨focus.aexp e₁, (ctxt.elet_l x ∅ e₂) :: c⟩, env, fs⟩ /- modifies frame -/
   */
  | {zipper: {focus_uid: (_, Exp((_, Let(x, ae1, e2)))), ctxts_uid: c}, env_uid, stack_uid} =>
    let (x_uid, _) = x;
    let (ae1_uid, _) = ae1;
    let (e2_uid, _) = e2;
    let (c_uid, _) = c;
    let (en_uid, _) = env_uid;
    let (s_uid, _) = stack_uid;
    Some((
      config(
        ~zipper=
          zipper(
            ~focus_uid=focus_uid(AExp(ae1)),
            ~ctxts_uid=ctxts_uid(Ctxt(ctxt_uid(LetL(x, (), e2)), c)),
          ),
        ~env_uid,
        ~stack_uid,
      ),
      (
        "let_begin",
        MS.fromArray([|
          (x_uid, [x_uid]),
          (ae1_uid, [ae1_uid]),
          (e2_uid, [e2_uid]),
          (c_uid, [c_uid]),
          (en_uid, [en_uid]),
          (s_uid, [s_uid]),
        |]),
      ),
    ));
  /* let_l */
  /*
    | elet_l {v x e₂ c env fs} :
    small_step ⟨⟨focus.val v, (ctxt.elet_l x ∅ e₂) :: c⟩, env, fs⟩ /- modifies frame -/
               ⟨⟨focus.exp e₂, c⟩, env.bind (binding.intro x v), fs⟩
   */
  | {
      zipper: {focus_uid: (_, Value(v)), ctxts_uid: (_, Ctxt((_, LetL(x, (), e2)), c))},
      env_uid: en,
      stack_uid: s,
    } =>
    let (v_uid, _) = v;
    let (x_uid, _) = x;
    let (e2_uid, _) = e2;
    let (c_uid, _) = c;
    let (en_uid, _) = en;
    let (s_uid, _) = s;
    Some((
      config(
        ~zipper=zipper(~focus_uid=focus_uid(Exp(e2)), ~ctxts_uid=c),
        ~env_uid=env_uid(Env(binding(~vid=x, ~value_uid=v), en)),
        ~stack_uid=s,
      ),
      (
        "let_l",
        MS.fromArray([|
          (v_uid, [v_uid]),
          (x_uid, [x_uid]),
          (e2_uid, [e2_uid]),
          (c_uid, [c_uid]),
          (en_uid, [en_uid]),
          (s_uid, [s_uid]),
        |]),
      ),
    ));
  /* num */
  /*
    | num {n c env fs} :
    small_step ⟨⟨focus.aexp (aexp.num n), c⟩, env, fs⟩ ⟨⟨focus.val (val.vnum n), c⟩, env, fs⟩
   */
  | {zipper: {focus_uid: (_, AExp((_, Num(n)))), ctxts_uid: c}, env_uid: en, stack_uid: s} =>
    let (n_uid, _) = n;
    let (c_uid, _) = c;
    let (en_uid, _) = en;
    let (s_uid, _) = s;
    Some((
      config(
        ~zipper=zipper(~focus_uid=focus_uid(Value(value_uid(VNum(n)))), ~ctxts_uid=c),
        ~env_uid=en,
        ~stack_uid=s,
      ),
      (
        "num",
        MS.fromArray([|
          (n_uid, [n_uid]),
          (c_uid, [c_uid]),
          (en_uid, [en_uid]),
          (s_uid, [s_uid]),
        |]),
      ),
    ));
  /* add */
  /* add_begin */
  /*
    | add_begin {x y c env fs} :
    small_step ⟨⟨focus.aexp (aexp.add x y), c⟩, env, fs⟩
               ⟨⟨focus.aexp x, (ctxt.add_l ∅ y) :: c⟩, env, fs⟩
   */
  | {zipper: {focus_uid: (_, AExp((_, Add(x, y)))), ctxts_uid: c}, env_uid: en, stack_uid: s} =>
    let (x_uid, _) = x;
    let (y_uid, _) = y;
    let (c_uid, _) = c;
    let (en_uid, _) = en;
    let (s_uid, _) = s;
    Some((
      config(
        ~zipper=
          zipper(
            ~focus_uid=focus_uid(AExp(x)),
            ~ctxts_uid=ctxts_uid(Ctxt(ctxt_uid(AddL((), y)), c)),
          ),
        ~env_uid=en,
        ~stack_uid=s,
      ),
      (
        "add_begin",
        MS.fromArray([|
          (x_uid, [x_uid]),
          (y_uid, [y_uid]),
          (c_uid, [c_uid]),
          (en_uid, [en_uid]),
          (s_uid, [s_uid]),
        |]),
      ),
    ));
  /* add_l */
  /*
    | add_l {v y c env fs} :
    small_step ⟨⟨focus.val v, (ctxt.add_l ∅ y) :: c⟩, env, fs⟩
               ⟨⟨focus.aexp y, (ctxt.add_r v ∅) :: c⟩, env, fs⟩
   */
  | {
      zipper: {focus_uid: (_, Value(v)), ctxts_uid: (_, Ctxt((_, AddL((), y)), c))},
      env_uid: en,
      stack_uid: s,
    } =>
    let (v_uid, _) = v;
    let (y_uid, _) = y;
    let (c_uid, _) = c;
    let (en_uid, _) = en;
    let (s_uid, _) = s;
    Some((
      config(
        ~zipper=
          zipper(
            ~focus_uid=focus_uid(AExp(y)),
            ~ctxts_uid=ctxts_uid(Ctxt(ctxt_uid(AddR(v, ())), c)),
          ),
        ~env_uid=en,
        ~stack_uid=s,
      ),
      (
        "add_l",
        MS.fromArray([|
          (v_uid, [v_uid]),
          (y_uid, [y_uid]),
          (c_uid, [c_uid]),
          (en_uid, [en_uid]),
          (s_uid, [s_uid]),
        |]),
      ),
    ));
  /* add_r */
  /*
    | add_r {x y z c env fs} (hz : z = x + y) :
    small_step ⟨⟨focus.val (val.vnum y), (ctxt.add_r (val.vnum x) ∅) :: c⟩, env, fs⟩
               ⟨⟨focus.val (val.vnum z), c⟩, env, fs⟩
   */
  | {
      zipper: {
        focus_uid: (_, Value((_, VNum(y)))),
        ctxts_uid: (_, Ctxt((_, AddR((_, VNum(x)), ())), c)),
      },
      env_uid: en,
      stack_uid: s,
    } =>
    let (x_uid, x_val) = x;
    let (y_uid, y_val) = y;
    let (z_uid, z_val) = (rauc(), x_val + y_val);
    let (c_uid, _) = c;
    let (en_uid, _) = en;
    let (s_uid, _) = s;
    Some((
      config(
        ~zipper=
          zipper(~focus_uid=focus_uid(Value(value_uid(VNum((z_uid, z_val))))), ~ctxts_uid=c),
        ~env_uid=en,
        ~stack_uid=s,
      ),
      (
        "add_r",
        MS.fromArray([|
          (x_uid, [z_uid]),
          (y_uid, [z_uid]),
          (c_uid, [c_uid]),
          (en_uid, [en_uid]),
          (s_uid, [s_uid]),
        |]),
      ),
    ));
  /* bracket */
  /*
    | bracket {e c env fs} :
    small_step ⟨⟨focus.aexp (aexp.bracket e), c⟩, env, fs⟩
               ⟨⟨focus.exp e, []⟩, env, ⟨c, env⟩ :: fs⟩
   */
  | {zipper: {focus_uid: (_, AExp((_, Bracket(e)))), ctxts_uid: c}, env_uid: en, stack_uid: s} =>
    let (e_uid, _) = e;
    let (c_uid, _) = c;
    let (en_uid, en_val) = en;
    let en_uid2 = rauc();
    let (s_uid, _) = s;
    Some((
      config(
        ~zipper=zipper(~focus_uid=focus_uid(Exp(e)), ~ctxts_uid=ctxts_uid(Empty)),
        ~env_uid=en,
        ~stack_uid=stack_uid(Stack(frame(~ctxts_uid=c, ~env_uid=(en_uid2, en_val)), s)),
      ),
      (
        "bracket",
        MS.fromArray([|
          (e_uid, [e_uid]),
          (c_uid, [c_uid]),
          (en_uid, [en_uid, en_uid2]),
          (s_uid, [s_uid]),
        |]),
      ),
    ));
  /* lift */
  /*
    | lift {a c env fs} :
    small_step ⟨⟨focus.exp (exp.lift a), c⟩, env, fs⟩
               ⟨⟨focus.aexp a, c⟩, env, fs⟩
   */
  | {zipper: {focus_uid: (_, Exp((_, Lift(a)))), ctxts_uid: c}, env_uid: en, stack_uid: s} =>
    let (a_uid, _) = a;
    let (c_uid, _) = c;
    let (en_uid, _) = en;
    let (s_uid, _) = s;
    Some((
      config(
        ~zipper=zipper(~focus_uid=focus_uid(AExp(a)), ~ctxts_uid=c),
        ~env_uid=en,
        ~stack_uid=s,
      ),
      (
        "lift",
        MS.fromArray([|
          (a_uid, [a_uid]),
          (c_uid, [c_uid]),
          (en_uid, [en_uid]),
          (s_uid, [s_uid]),
        |]),
      ),
    ));
  // | {focus, frame, stack} => Some({focus: sorry, frame: sorry, stack: sorry})
  | _ => None
  };

/* to uid */
let vidToUID = (v: FFS5.vid): vid => vid(v);

let intToUID = (n: int): int_uid => int_uid(n);

let rec lambdaToUID = ({vid, exp}: FFS5.lambda): lambda =>
  lambda(~vid=vidToUID(vid), ~exp_uid=expToUID(exp))

and aexpToUID = (ae: FFS5.aexp): aexp_uid =>
  (
    switch (ae) {
    | Var(v) => Var(vidToUID(v))
    | App(f, x) => App(aexpToUID(f), aexpToUID(x))
    | Lam(l) => Lam(lambdaToUID(l))
    | Num(n) => Num(intToUID(n))
    | Add(x, y) => Add(aexpToUID(x), aexpToUID(y))
    | Bracket(e) => Bracket(expToUID(e))
    }
  )
  |> aexp_uid

and expToUID = (e: FFS5.exp): exp_uid =>
  (
    switch (e) {
    | Lift(ae) => Lift(aexpToUID(ae))
    | Let(x, ae1, e2) => Let(vidToUID(x), aexpToUID(ae1), expToUID(e2))
    }
  )
  |> exp_uid

and valueToUID = (v: FFS5.value): value_uid =>
  (
    switch (v) {
    | VNum(n) => VNum(intToUID(n))
    | Clo(l, env) => Clo(lambdaToUID(l), envToUID(env))
    }
  )
  |> value_uid

and bindingToUID = ({vid, value}: FFS5.binding): binding =>
  binding(~vid=vidToUID(vid), ~value_uid=valueToUID(value))

and envToUID = (e: FFS5.env): env_uid =>
  (
    switch (e) {
    | [] => (Empty: env)
    | [b, ...env] => Env(bindingToUID(b), envToUID(env))
    }
  )
  |> env_uid;

let ctxtToUID = (c: FFS5.ctxt): ctxt_uid =>
  (
    switch (c) {
    | AppL((), ae) => AppL((), aexpToUID(ae))
    | AppR(v, ()) => AppR(valueToUID(v), ())
    | LetL(x, (), e) => LetL(vidToUID(x), (), expToUID(e))
    | AddL((), ae) => AddL((), aexpToUID(ae))
    | AddR(v, ()) => AddR(valueToUID(v), ())
    }
  )
  |> ctxt_uid;

let rec ctxtsToUID = (cs: list(FFS5.ctxt)): ctxts_uid =>
  (
    switch (cs) {
    | [] => (Empty: ctxts)
    | [c, ...cs] => Ctxt(ctxtToUID(c), ctxtsToUID(cs))
    }
  )
  |> ctxts_uid;

let focusToUID = (f: FFS5.focus): focus_uid =>
  (
    switch (f) {
    | AExp(ae) => AExp(aexpToUID(ae))
    | Exp(e) => Exp(expToUID(e))
    | Value(v) => Value(valueToUID(v))
    }
  )
  |> focus_uid;

let zipperToUID = ({focus, ctxts}: FFS5.zipper): zipper =>
  zipper(~focus_uid=focusToUID(focus), ~ctxts_uid=ctxtsToUID(ctxts));

let frameToUID = ({ctxts, env}: FFS5.frame): frame =>
  frame(~ctxts_uid=ctxtsToUID(ctxts), ~env_uid=envToUID(env));

let rec stackToUID = (s: list(FFS5.frame)): stack_uid =>
  (
    switch (s) {
    | [] => (Empty: stack)
    | [f, ...s] => Stack(frameToUID(f), stackToUID(s))
    }
  )
  |> stack_uid;

let configToUID = ({zipper, env, stack}: FFS5.config): config =>
  config(~zipper=zipperToUID(zipper), ~env_uid=envToUID(env), ~stack_uid=stackToUID(stack));

/* from uid */

let vidFromUID = ((_, v): vid): FFS5.vid => v;

let intFromUID = ((_, n): int_uid): int => n;

let rec lambdaFromUID = ({vid, exp_uid}: lambda): FFS5.lambda => {
  vid: vidFromUID(vid),
  exp: expFromUID(exp_uid),
}

and aexpFromUID = ((_, ae): aexp_uid): FFS5.aexp =>
  switch (ae) {
  | Var(v) => Var(vidFromUID(v))
  | App(f, x) => App(aexpFromUID(f), aexpFromUID(x))
  | Lam(l) => Lam(lambdaFromUID(l))
  | Num(n) => Num(intFromUID(n))
  | Add(x, y) => Add(aexpFromUID(x), aexpFromUID(y))
  | Bracket(e) => Bracket(expFromUID(e))
  }

and expFromUID = ((_, e): exp_uid): FFS5.exp =>
  switch (e) {
  | Lift(ae) => Lift(aexpFromUID(ae))
  | Let(x, ae1, e2) => Let(vidFromUID(x), aexpFromUID(ae1), expFromUID(e2))
  }

and valueFromUID = ((_, v): value_uid): FFS5.value =>
  switch (v) {
  | VNum(n) => VNum(intFromUID(n))
  | Clo(l, env) => Clo(lambdaFromUID(l), envFromUID(env))
  }

and bindingFromUID = ({vid, value_uid}: binding): FFS5.binding => {
  vid: vidFromUID(vid),
  value: valueFromUID(value_uid),
}

and envFromUID = ((_, e): env_uid): FFS5.env =>
  switch (e) {
  | Empty => []
  | Env(b, env) => [bindingFromUID(b), ...envFromUID(env)]
  };

let ctxtFromUID = ((_, c): ctxt_uid): FFS5.ctxt =>
  switch (c) {
  | AppL((), ae) => AppL((), aexpFromUID(ae))
  | AppR(v, ()) => AppR(valueFromUID(v), ())
  | LetL(x, (), e) => LetL(vidFromUID(x), (), expFromUID(e))
  | AddL((), ae) => AddL((), aexpFromUID(ae))
  | AddR(v, ()) => AddR(valueFromUID(v), ())
  };

let rec ctxtsFromUID = ((_, cs): ctxts_uid): list(FFS5.ctxt) =>
  switch (cs) {
  | Empty => []
  | Ctxt(c, cs) => [ctxtFromUID(c), ...ctxtsFromUID(cs)]
  };

let focusFromUID = ((_, f): focus_uid): FFS5.focus =>
  switch (f) {
  | AExp(ae) => AExp(aexpFromUID(ae))
  | Exp(e) => Exp(expFromUID(e))
  | Value(v) => Value(valueFromUID(v))
  };

let zipperFromUID = ({focus_uid, ctxts_uid}: zipper): FFS5.zipper => {
  focus: focusFromUID(focus_uid),
  ctxts: ctxtsFromUID(ctxts_uid),
};

let frameFromUID = ({ctxts_uid, env_uid}: frame): FFS5.frame => {
  ctxts: ctxtsFromUID(ctxts_uid),
  env: envFromUID(env_uid),
};

let rec stackFromUID = ((_, s): stack_uid): list(FFS5.frame) =>
  switch (s) {
  | Empty => []
  | Stack(f, s) => [frameFromUID(f), ...stackFromUID(s)]
  };

let configFromUID = ({zipper, env_uid, stack_uid}: config): FFS5.config => {
  zipper: zipperFromUID(zipper),
  env: envFromUID(env_uid),
  stack: stackFromUID(stack_uid),
};

/* def inject (e : exp) : state := ⟨sum.inl e, ⟨option.none, env.emp⟩, []⟩ */
let inject = (e: FFS5.exp): config =>
  config(
    ~zipper=zipper(~focus_uid=focus_uid(Exp(e |> expToUID)), ~ctxts_uid=ctxts_uid(Empty)),
    ~env_uid=env_uid(Empty),
    ~stack_uid=stack_uid(Empty),
  );

/* def is_final : state -> Prop
   | ⟨sum.inr v, ⟨option.none, env⟩, []⟩ := true
   | _ := false */

let isFinal = (c: config): bool =>
  switch (c) {
  | {
      zipper: {focus_uid: (_, Value(_)), ctxts_uid: (_, Empty)},
      env_uid: _,
      stack_uid: (_, Empty),
    } =>
    true
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

let interpretTrace = (p: FFS5.exp): list((flow, config)) => {
  let (states, rules) = iterateMaybeSideEffect(step, inject(p));
  Js.log2("rules", rules |> Array.of_list);
  let (_, flow) = rules |> List.split;
  List.combine(flow @ [MS.empty], takeWhileInclusive(c => !isFinal(c), states));
};

let interpret = p => {
  let (_, s) = interpretTrace(p) |> List.rev |> List.hd;
  switch (s) {
  | {zipper: {focus_uid: (_, Value(v)), ctxts_uid: _}, env_uid: _, stack_uid: _} =>
    valueFromUID(v)
  | _ => raise(failwith("expected a value"))
  };
};

let loading: config = inject(Lift(Var("loading...")));