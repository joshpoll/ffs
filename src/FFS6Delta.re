/* Like FFS5, but uses more generic form of zipper */
/* starting with delta-less FFS6 to get the semantics right */
open UID;

type hole = unit;

type vid_aux = string;

type vid = makeUIDType(vid_aux);

type int_uid = makeUIDType(int);

type zexp_aux('op) = {
  op: 'op,
  args: aexps,
}

and zexp('op) = makeUIDType(zexp_aux('op))

and zctxt_aux('op) = {
  op: 'op,
  args: aexps,
  values,
}

and zctxt('op) = makeUIDType(zctxt_aux('op))

and zpreval_aux('op) = {
  op: 'op,
  values,
}

and zpreval('op) = makeUIDType(zpreval_aux('op))

and lambda_aux = {
  vid,
  exp,
}

and lambda = makeUIDType(lambda_aux)

and aexp_op_aux =
  | Var(vid)
  | App
  | Lam(lambda)
  | Num(int_uid)
  | Add
  | Bracket(exp)

and aexp_op = makeUIDType(aexp_op_aux)

and aexp_aux = zexp_aux(op)

and aexp = makeUIDType(aexp_aux)

and aexps_aux = makeUIDListTypeAux(aexp_aux)
and aexps = makeUIDListType(aexp_aux)

and exp_op_aux =
  | Lift(aexp)
  | Let(vid, exp)

and exp_op = makeUIDType(exp_op_aux)

and exp_aux = zexp_aux(op)

and exp = makeUIDType(exp_aux)

and op_aux =
  | Exp(exp_op)
  | AExp(aexp_op)

and op = makeUIDType(op_aux)

and value_aux =
  | VNum(int_uid)
  | Clo(lambda, env)

and value = makeUIDType(value_aux)

and values_aux = makeUIDListTypeAux(value_aux)
and values = makeUIDListType(value_aux)

and binding_aux = {
  vid,
  value,
}

and binding = makeUIDType(binding_aux)

and env_aux = makeUIDListTypeAux(binding_aux)
and env = makeUIDListType(binding_aux);

type focus_aux =
  | ZExp(zexp(op))
  | ZPreVal(zpreval(op))
  | Value(value);

type focus = makeUIDType(focus_aux);

type ctxts_aux = makeUIDListTypeAux(zctxt_aux(op));
type ctxts = makeUIDListType(zctxt_aux(op));

type zipper_aux = {
  focus,
  ctxts,
};

type zipper = makeUIDType(zipper_aux);

type frame_aux = {
  ctxts,
  env,
};

type frame = makeUIDType(frame_aux);

type stack_aux = makeUIDListTypeAux(frame_aux);
type stack = makeUIDListType(frame_aux);

type config_aux = {
  zipper,
  env,
  stack,
};

type config = makeUIDType(config_aux);

let mkVid = (v: vid_aux) => makeUIDConstructor("vid", v);
let mkInt = (n: int) => makeUIDConstructor("int", n);
let mkZExp = (ze: zexp_aux('a)) => makeUIDConstructor("zexp", ze);
let mkZCtxt = (zc: zctxt_aux('a)) => makeUIDConstructor("zctxt", zc);
let mkZPreVal = (zp: zpreval_aux('a)) => makeUIDConstructor("zpreval", zp);
let mkLambda = (l: lambda_aux) => makeUIDConstructor("lambda", l);
let mkAExpOp = (aeo: aexp_op_aux) => makeUIDConstructor("aexp_op", aeo);
let mkAExp = (ae: aexp_aux) => makeUIDConstructor("aexp", ae);
let mkAExps = (aes: aexps_aux) => makeUIDConstructor("aexps", aes);
let mkExpOp = (eo: exp_op_aux) => makeUIDConstructor("exp_op", eo);
let mkExp = (e: exp_aux) => makeUIDConstructor("exp", e);
let mkOp = (o: op_aux) => makeUIDConstructor("op", o);
let mkValue = (v: value_aux) => makeUIDConstructor("value", v);
let mkValues = (vs: values_aux) => makeUIDConstructor("values", vs);
let mkBinding = (b: binding_aux) => makeUIDConstructor("binding", b);
let mkEnv = (e: env_aux) => makeUIDConstructor("env", e);
let mkFocus = (f: focus_aux) => makeUIDConstructor("focus", f);
let mkCtxts = (cs: ctxts_aux) => makeUIDConstructor("ctxts", cs);
let mkZipper = (z: zipper_aux) => makeUIDConstructor("zipper", z);
let mkFrame = (f: frame_aux) => makeUIDConstructor("frame", f);
let mkStack = (s: stack_aux) => makeUIDConstructor("stack", s);
let mkConfig = (c: config_aux) => makeUIDConstructor("config", c);

/* let rec lookup = (x: vid, env: env): option(value) =>
   switch (env) {
   | [] => None
   | [{vid: y, value: v}, ...env] =>
     if (x == y) {
       Some(v);
     } else {
       lookup(x, env);
     }
   }; */
/* TODO: x_uid and y_uid should be involved in animations */
let rec lookup = (x: vid, env: env): option((value, Flow.t)) => {
  let (x_uid, x_val) = x;
  let (env_uid, env_val) = env;
  switch (env_val) {
  | Empty => None
  | Cons((_, {vid: y, value: (v_uid, v_val)}), (_, env_val)) =>
    let (y_uid, y_val) = y;
    if (x_val == y_val) {
      let fresh = "valLookup_" ++ rauc();
      switch (v_val) {
      | VNum((_, n)) =>
        Some((
          (fresh, VNum(("valLookup_int_" ++ rauc(), n))), /* hack special-casing so we get a fresh
           uid for num to avoid duplicated uids later. */
          Flow.fromArray([|
            /* [|(x_uid, [fresh]), (env_uid, [fresh])|] */
            (v_uid, [v_uid, fresh]),
          |]),
        ))
      | _ =>
        Some((
          (fresh, v_val),
          Flow.fromArray([|
            /* [|(x_uid, [fresh]), (env_uid, [fresh])|] */
            (v_uid, [v_uid, fresh]),
          |]),
        ))
      };
    } else {
      lookup(x, (env_uid, env_val));
    };
  };
};

/* TODO: improve transition annotations */
let step = ((_, c): config): option((config, (string, Flow.t))) =>
  switch (c) {
  /* val */
  /* | {zipper: {focus: ZExp({op: AExp(Var(x)), args: []}), ctxts}, env, stack} =>
     switch (lookup(x, env)) {
     | None => None
     | Some(v) => Some({
                    zipper: {
                      focus: Value(v),
                      ctxts,
                    },
                    env,
                    stack,
                  }) */
  | {
      zipper: (
        _,
        {
          focus: (
            _,
            ZExp((_, {op: (_, AExp((_, Var((x_uid, _) as x)))), args: (_, Empty)})),
          ),
          ctxts: (ctxts_uid, _) as ctxts,
        },
      ),
      env: (env_uid, _) as env,
      stack: (stack_uid, _) as stack,
    } =>
    switch (lookup(x, env)) {
    | Some((v, lookup_ribbon)) =>
      Some((
        mkConfig({zipper: mkZipper({focus: mkFocus(Value(v)), ctxts}), env, stack}),
        (
          "var",
          Flow.merge(
            Flow.fromArray([|
              (x_uid, []),
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
  /* | {zipper: {focus: ZExp({op: AExp(Lam(l)), args: []}), ctxts}, env, stack} =>
     Some({
       zipper: {
         focus: Value(Clo(l, env)),
         ctxts,
       },
       env,
       stack,
     }) */
  | {
      zipper: (
        _,
        {focus: (_, ZExp((_, {op: (_, AExp((_, Lam(l)))), args: (_, Empty)}))), ctxts},
      ),
      env,
      stack,
    } =>
    Some((
      mkConfig({
        zipper: mkZipper({focus: mkFocus(Value(mkValue(Clo(l, env)))), ctxts}),
        env,
        stack,
      }),
      ("lam", Flow.fromArray([||])),
    ))
  /* zipper skip */
  /* | {zipper: {focus: ZExp({op, args: []}), ctxts}, env, stack} =>
     Some({
       zipper: {
         focus: ZPreVal({op, values: []}),
         ctxts,
       },
       env,
       stack,
     }) */
  | {zipper: (_, {focus: (_, ZExp((_, {op, args: (_, Empty)}))), ctxts}), env, stack} =>
    Some((
      mkConfig({
        zipper:
          mkZipper({
            focus: mkFocus(ZPreVal(mkZPreVal({op, values: mkValues(Empty)}))),
            ctxts,
          }),
        env,
        stack,
      }),
      ("zipper skip", Flow.fromArray([||])),
    ))
  /* zipper begin */
  /* | {zipper: {focus: ZExp({op, args: [a, ...args]}), ctxts}, env, stack} =>
     Some({
       zipper: {
         focus: ZExp(a),
         ctxts: [{op, args, values: []}, ...ctxts],
       },
       env,
       stack,
     }) */
  | {
      zipper: (_, {focus: (_, ZExp((_, {op, args: (_, Cons(a, args))}))), ctxts}),
      env,
      stack,
    } =>
    Some((
      mkConfig({
        zipper:
          mkZipper({
            focus: mkFocus(ZExp(a)),
            ctxts: mkCtxts(Cons(mkZCtxt({op, args, values: mkValues(Empty)}), ctxts)),
          }),
        env,
        stack,
      }),
      ("zipper begin", Flow.fromArray([||])),
    ))
  /* zipper continue */
  /*  | {
        zipper: {focus: Value(v), ctxts: [{op, args: [a, ...args], values}, ...ctxts]},
        env,
        stack,
      } =>
      Some({
        zipper: {
          focus: ZExp(a),
          ctxts: [{op, args, values: [v, ...values]}, ...ctxts],
        },
        env,
        stack,
      }) */
  | {
      zipper: (
        _,
        {
          focus: (_, Value(v)),
          ctxts: (_, Cons((_, {op, args: (_, Cons(a, args)), values}), ctxts)),
        },
      ),
      env,
      stack,
    } =>
    Some((
      mkConfig({
        zipper:
          mkZipper({
            focus: mkFocus(ZExp(a)),
            ctxts:
              mkCtxts(Cons(mkZCtxt({op, args, values: mkValues(Cons(v, values))}), ctxts)),
          }),
        env,
        stack,
      }),
      ("zipper continue", Flow.fromArray([||])),
    ))

  /* zipper end */
  /* NOTE! The delta version doesn't reverse the list, because that would make things harder. */
  /* | {zipper: {focus: Value(v), ctxts: [{op, args: [], values}, ...ctxts]}, env, stack} =>
     Some({
       zipper: {
         focus: ZPreVal({op, values: List.rev(values)}),
         ctxts,
       },
       env,
       stack,
     }) */
  | {
      zipper: (
        _,
        {
          focus: (_, Value(v)),
          ctxts: (_, Cons((_, {op, args: (_, Empty), values}), ctxts)),
        },
      ),
      env,
      stack,
    } =>
    Js.log2("values at zipper end:", values);
    Some((
      mkConfig({
        zipper:
          mkZipper({
            focus: mkFocus(ZPreVal(mkZPreVal({op, values: mkValues(Cons(v, values))}))),
            ctxts,
          }),
        env,
        stack,
      }),
      ("zipper end", Flow.fromArray([||])),
    ));
  /* app enter */
  /* | {
       zipper: {
         focus: ZPreVal({op: AExp(App), values: [Clo({vid: x, exp: e}, env), v2]}),
         ctxts,
       },
       env: env',
       stack,
     } =>
     Some({
       zipper: {
         focus: ZExp(e),
         ctxts: [],
       },
       env: [{vid: x, value: v2}, ...env],
       stack: [{ctxts, env: env'}, ...stack],
     }) */
  | {
      zipper: (
        _,
        {
          focus: (
            _,
            ZPreVal((
              _,
              {
                op: (_, AExp((_, App))),
                values: (
                  _,
                  Cons(v2, (_, Cons((_, Clo((_, {vid: x, exp: e}), env)), (_, Empty)))),
                ),
              },
            )),
          ),
          ctxts,
        },
      ),
      env: env',
      stack,
    } =>
    Some((
      mkConfig({
        zipper: mkZipper({focus: mkFocus(ZExp(e)), ctxts: mkCtxts(Empty)}),
        env: mkEnv(Cons(mkBinding({vid: x, value: v2}), env)),
        stack: mkStack(Cons(mkFrame({ctxts, env: env'}), stack)),
      }),
      ("app enter", Flow.fromArray([||])),
    ))
  /* app exit */
  | {
      zipper: (_, {focus: (_, Value(v)), ctxts: (_, Empty)}),
      env,
      stack: (_, Cons((_, {ctxts, env: env'}), stack)),
    } =>
    Some((
      mkConfig({zipper: mkZipper({focus: mkFocus(Value(v)), ctxts}), env: env', stack}),
      ("app exit", Flow.fromArray([||])),
    ))
  /* let */
  | {
      zipper: (
        _,
        {
          focus: (
            _,
            ZPreVal((
              _,
              {op: (_, Exp((_, Let(x, e2)))), values: (_, Cons(v1, (_, Empty)))},
            )),
          ),
          ctxts,
        },
      ),
      env,
      stack,
    } =>
    Some((
      mkConfig({
        zipper: mkZipper({focus: mkFocus(ZExp(e2)), ctxts}),
        env: mkEnv(Cons(mkBinding({vid: x, value: v1}), env)),
        stack,
      }),
      ("let", Flow.fromArray([||])),
    ))
  /* num */
  | {
      zipper: (
        _,
        {focus: (_, ZPreVal((_, {op: (_, AExp((_, Num(n)))), values: (_, Empty)}))), ctxts},
      ),
      env,
      stack,
    } =>
    Some((
      mkConfig({
        zipper: mkZipper({focus: mkFocus(Value(mkValue(VNum(n)))), ctxts}),
        env,
        stack,
      }),
      ("num", Flow.fromArray([||])),
    ))
  /* add */
  | {
      zipper: (
        _,
        {
          focus: (
            _,
            ZPreVal((
              _,
              {
                op: (_, AExp((_, Add))),
                values: (
                  _,
                  Cons(
                    (_, VNum((v2_uid, v2_val))),
                    (_, Cons((_, VNum((v1_uid, v1_val))), (_, Empty))),
                  ),
                ),
              },
            )),
          ),
          ctxts,
        },
      ),
      env,
      stack,
    } =>
    let v3_val = v1_val + v2_val;
    Some((
      mkConfig({
        zipper: mkZipper({focus: mkFocus(Value(mkValue(VNum(mkInt(v3_val))))), ctxts}),
        env,
        stack,
      }),
      ("add", Flow.fromArray([||])),
    ));
  /* bracket */
  | {
      zipper: (
        _,
        {
          focus: (_, ZPreVal((_, {op: (_, AExp((_, Bracket(e)))), values: (_, Empty)}))),
          ctxts,
        },
      ),
      env,
      stack,
    } =>
    Some((
      mkConfig({
        zipper: mkZipper({focus: mkFocus(ZExp(e)), ctxts: mkCtxts(Empty)}),
        env,
        stack: mkStack(Cons(mkFrame({ctxts, env}), stack)),
      }),
      ("bracket", Flow.fromArray([||])),
    ))
  /* lift */
  | {
      zipper: (
        _,
        {
          focus: (_, ZPreVal((_, {op: (_, Exp((_, Lift(ae)))), values: (_, Empty)}))),
          ctxts,
        },
      ),
      env,
      stack,
    } =>
    Some((
      mkConfig({zipper: mkZipper({focus: mkFocus(ZExp(ae)), ctxts}), env, stack}),
      ("lift", Flow.fromArray([||])),
    ))
  | _ => None
  };

/* to uid */
let vidToUID = (v: FFS6.vid): vid => mkVid(v);

let intToUID = (n: int): int_uid => mkInt(n);

/* TODO: op should be compiled, too */
let rec zexpToUID = (opToUID, {op, args}: FFS6.zexp('a)): zexp('b) =>
  mkZExp({op: opToUID(op), args: aexpsToUID(args)})

and zctxtToUID = (opToUID, {op, args, values}: FFS6.zctxt('a)): zctxt('b) =>
  mkZCtxt({op: opToUID(op), args: aexpsToUID(args), values: valuesToUID(values)})

and zprevalToUID = (opToUID, {op, values}: FFS6.zpreval('a)): zpreval('b) =>
  mkZPreVal({op: opToUID(op), values: valuesToUID(values)})

and lambdaToUID = ({vid, exp}: FFS6.lambda): lambda =>
  mkLambda({vid: vidToUID(vid), exp: expToUID(exp)})

and aexp_opToUID = (aeo: FFS6.aexp_op): aexp_op =>
  (
    switch (aeo) {
    | Var(vid) => Var(vidToUID(vid))
    | App => App
    | Lam(lambda) => Lam(lambdaToUID(lambda))
    | Num(int) => Num(intToUID(int))
    | Add => Add
    | Bracket(exp) => Bracket(expToUID(exp))
    }
  )
  |> mkAExpOp

and aexpToUID = (ae: FFS6.aexp): aexp => zexpToUID(opToUID, ae)

and aexpsToUID = (aes: list(FFS6.aexp)): aexps =>
  (
    switch (aes) {
    | [] => Empty
    | [ae, ...aes] => Cons(aexpToUID(ae), aexpsToUID(aes))
    }
  )
  |> mkAExps

and exp_opToUID = (eo: FFS6.exp_op): exp_op =>
  (
    switch (eo) {
    | Lift(aexp) => Lift(aexpToUID(aexp))
    | Let(vid, exp) => Let(vidToUID(vid), expToUID(exp))
    }
  )
  |> mkExpOp

and expToUID = (e: FFS6.exp): exp => zexpToUID(opToUID, e)

and opToUID = (o: FFS6.op): op =>
  (
    switch (o) {
    | Exp(exp_op) => Exp(exp_opToUID(exp_op))
    | AExp(aexp_op) => AExp(aexp_opToUID(aexp_op))
    }
  )
  |> mkOp

and valueToUID = (v: FFS6.value): value =>
  (
    switch (v) {
    | VNum(int) => VNum(intToUID(int))
    | Clo(lambda, env) => Clo(lambdaToUID(lambda), envToUID(env))
    }
  )
  |> mkValue

and valuesToUID = (vs: list(FFS6.value)): values =>
  (
    switch (vs) {
    | [] => Empty
    | [v, ...vs] => Cons(valueToUID(v), valuesToUID(vs))
    }
  )
  |> mkValues

and bindingToUID = ({vid, value}: FFS6.binding): binding =>
  mkBinding({vid: vidToUID(vid), value: valueToUID(value)})

and envToUID = (e: FFS6.env): env =>
  (
    switch (e) {
    | [] => Empty
    | [b, ...e] => Cons(bindingToUID(b), envToUID(e))
    }
  )
  |> mkEnv

and focusToUID = (f: FFS6.focus): focus =>
  (
    switch (f) {
    | ZExp(zeo) => ZExp(zexpToUID(opToUID, zeo))
    | ZPreVal(zpvo) => ZPreVal(zprevalToUID(opToUID, zpvo))
    | Value(value) => Value(valueToUID(value))
    }
  )
  |> mkFocus

and ctxtsToUID = (cs: FFS6.ctxts): ctxts =>
  (
    switch (cs) {
    | [] => Empty
    | [c, ...cs] => Cons(zctxtToUID(opToUID, c), ctxtsToUID(cs))
    }
  )
  |> mkCtxts

and zipperToUID = ({focus, ctxts}: FFS6.zipper): zipper =>
  mkZipper({focus: focusToUID(focus), ctxts: ctxtsToUID(ctxts)})

and frameToUID = ({ctxts, env}: FFS6.frame): frame =>
  mkFrame({ctxts: ctxtsToUID(ctxts), env: envToUID(env)})

and stackToUID = (s: FFS6.stack): stack =>
  (
    switch (s) {
    | [] => Empty
    | [f, ...s] => Cons(frameToUID(f), stackToUID(s))
    }
  )
  |> mkStack

and configToUID = ({zipper, env, stack}: FFS6.config): config =>
  mkConfig({zipper: zipperToUID(zipper), env: envToUID(env), stack: stackToUID(stack)});

/* from uid */
let vidFromUID = ((_, vid): vid): FFS6.vid => vid;

let intFromUID = ((_, int): int_uid): int => int;

let rec zexpFromUID = (opFromUID, (_, {op, args}): zexp('a)): FFS6.zexp('b) => {
  op: opFromUID(op),
  args: aexpsFromUID(args),
}

and zctxtFromUID = (opFromUID, (_, {op, args, values}): zctxt('a)): FFS6.zctxt('b) => {
  op: opFromUID(op),
  args: aexpsFromUID(args),
  values: valuesFromUID(values),
}

and zprevalFromUID = (opFromUID, (_, {op, values}): zpreval('a)): FFS6.zpreval('b) => {
  op: opFromUID(op),
  values: valuesFromUID(values),
}

and lambdaFromUID = ((_, {vid, exp}): lambda): FFS6.lambda => {
  vid: vidFromUID(vid),
  exp: expFromUID(exp),
}

and aexp_opFromUID = ((_, aeo): aexp_op): FFS6.aexp_op =>
  switch (aeo) {
  | Var(vid) => Var(vidFromUID(vid))
  | App => App
  | Lam(lambda) => Lam(lambdaFromUID(lambda))
  | Num(int) => Num(intFromUID(int))
  | Add => Add
  | Bracket(exp) => Bracket(expFromUID(exp))
  }

and aexpFromUID = (aexp: aexp): FFS6.aexp => zexpFromUID(opFromUID, aexp)

and aexpsFromUID = ((_, aexps): aexps): list(FFS6.aexp) =>
  switch (aexps) {
  | Empty => []
  | Cons(ae, aexps) => [aexpFromUID(ae), ...aexpsFromUID(aexps)]
  }

and exp_opFromUID = ((_, exp_op): exp_op): FFS6.exp_op =>
  switch (exp_op) {
  | Lift(aexp) => Lift(aexpFromUID(aexp))
  | Let(vid, exp) => Let(vidFromUID(vid), expFromUID(exp))
  }

and expFromUID = (exp: exp): FFS6.exp => zexpFromUID(opFromUID, exp)

and opFromUID = ((_, op): op): FFS6.op =>
  switch (op) {
  | Exp(exp_op) => Exp(exp_opFromUID(exp_op))
  | AExp(aexp_op) => AExp(aexp_opFromUID(aexp_op))
  }

and valueFromUID = ((_, value): value): FFS6.value =>
  switch (value) {
  | VNum(int) => VNum(intFromUID(int))
  | Clo(lambda, env) => Clo(lambdaFromUID(lambda), envFromUID(env))
  }

and valuesFromUID = ((_, values): values): list(FFS6.value) =>
  switch (values) {
  | Empty => []
  | Cons(value, values) => [valueFromUID(value), ...valuesFromUID(values)]
  }

and bindingFromUID = ((_, {vid, value}): binding): FFS6.binding => {
  vid: vidFromUID(vid),
  value: valueFromUID(value),
}

and envFromUID = ((_, env): env): FFS6.env =>
  switch (env) {
  | Empty => []
  | Cons(binding, env) => [bindingFromUID(binding), ...envFromUID(env)]
  }

and focusFromUID = ((_, focus): focus): FFS6.focus =>
  switch (focus) {
  | ZExp(zeo) => ZExp(zexpFromUID(opFromUID, zeo))
  | ZPreVal(zpvo) => ZPreVal(zprevalFromUID(opFromUID, zpvo))
  | Value(value) => Value(valueFromUID(value))
  }

and ctxtsFromUID = ((_, ctxts): ctxts): FFS6.ctxts =>
  switch (ctxts) {
  | Empty => []
  | Cons(ctxt, ctxts) => [zctxtFromUID(opFromUID, ctxt), ...ctxtsFromUID(ctxts)]
  }

and zipperFromUID = ((_, {focus, ctxts}): zipper): FFS6.zipper => {
  focus: focusFromUID(focus),
  ctxts: ctxtsFromUID(ctxts),
}

and frameFromUID = ((_, {ctxts, env}): frame): FFS6.frame => {
  ctxts: ctxtsFromUID(ctxts),
  env: envFromUID(env),
}

and stackFromUID = ((_, stack): stack): FFS6.stack =>
  switch (stack) {
  | Empty => []
  | Cons(frame, stack) => [frameFromUID(frame), ...stackFromUID(stack)]
  }

and configFromUID = ((_, {zipper, env, stack}): config): FFS6.config => {
  zipper: zipperFromUID(zipper),
  env: envFromUID(env),
  stack: stackFromUID(stack),
};

/* def inject (e : exp) : state := ⟨sum.inl e, ⟨option.none, env.emp⟩, []⟩ */
let inject = (e: FFS6.exp): config =>
  configToUID({
    zipper: {
      focus: ZExp(e),
      ctxts: [],
    },
    env: [],
    stack: [],
  });

/* def is_final : state -> Prop
   | ⟨sum.inr v, ⟨option.none, env⟩, []⟩ := true
   | _ := false */

let isFinal = ((_, c): config): bool =>
  switch (c) {
  | {zipper: (_, {focus: (_, Value(_)), ctxts: (_, Empty)}), env: _, stack: (_, Empty)} =>
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

let interpretTrace = (p: FFS6.exp): list(((string, Flow.t), config)) => {
  let (states, rules) = iterateMaybeSideEffect(step, inject(p));
  // Js.log2("rules", rules |> Array.of_list);
  let (actualRules, flow) = rules |> List.split;
  Js.log2("rules", List.combine(actualRules, List.map(Flow.toArray, flow)) |> Array.of_list);
  List.combine(rules @ [("", Flow.none)], takeWhileInclusive(c => !isFinal(c), states));
};

let interpret = p => {
  let (_, s) = interpretTrace(p) |> List.rev |> List.hd;
  switch (s) {
  | (_, {zipper: (_, {focus: (_, Value(v)), ctxts: _}), env: _, stack: _}) => valueFromUID(v)
  | _ => raise(failwith("expected a value"))
  };
};