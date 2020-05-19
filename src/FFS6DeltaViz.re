open Sidewinder.Theia;
open TheiaExtensions;
open FFS6Delta;

/* TODO: these rules assume uids flow down to children appropriately!
   That needs to be implemented in Sidewinder correctly. Also note that bubbling down relies on the
   fact that before- and after-nodes with the same id should have the same node hierarchy */
/* TODO: should bubbling only occur for nodes with no flow at all? */

let vizVid = (flow, (uid, vid): vid) => str(~uid, ~flow=?Flow.get(flow, uid), vid, ());

let vizInt = (flow, (uid, int): int_uid) =>
  str(~uid, ~flow=?Flow.get(flow, uid), string_of_int(int), ());

let rec vizZExp = (vizOp, flow, (uid, {op, args}): zexp('a)) =>
  noop(~uid, ~flow=?Flow.get(flow, uid), vizOp(flow, op, vizAExps(flow, args)), [], ())

and vizZCtxt = (vizOp, flow, (uid, {op, args, values}): zctxt('a), hole) =>
  noop(
    ~uid,
    ~flow=?Flow.get(flow, uid),
    vizOp(flow, op, vizValues(flow, values) @ [hole, ...vizAExps(flow, args)]),
    [],
    (),
  )

and vizZPreVal = (vizOp, flow, (uid, {op, values}): zpreval('a)) =>
  noop(~uid, ~flow=?Flow.get(flow, uid), vizOp(flow, op, vizValues(flow, values)), [], ())

and vizLambda = (flow, (uid, {vid, exp}): lambda) =>
  hSeq(
    ~uid,
    ~flow=?Flow.get(flow, uid),
    [str("\\", ()), vizVid(flow, vid), str(".", ()), vizExp(flow, exp)],
  )

and vizAExpOp = (flow, (uid, aexp_op): aexp_op, inputs: list(Sidewinder.Kernel.node)) =>
  switch (aexp_op, inputs) {
  | (Var(vid), []) => noop(~uid, ~flow=?Flow.get(flow, uid), vizVid(flow, vid), [], ())
  | (Var(_), _) =>
    failwith("op Var expected input arity 0, but got " ++ string_of_int(List.length(inputs)))
  | (App, [f, x]) => hSeq(~uid, ~flow=?Flow.get(flow, uid), ~gap=2., [paren(f), paren(x)])
  | (App, _) =>
    failwith("op App expected input arity 2, but got " ++ string_of_int(List.length(inputs)))
  | (Lam(lambda), []) =>
    noop(~uid, ~flow=?Flow.get(flow, uid), vizLambda(flow, lambda), [], ())
  | (Lam(_), _) =>
    failwith("op Lam expected input arity 0, but got " ++ string_of_int(List.length(inputs)))
  | (Num(int), []) => noop(~uid, ~flow=?Flow.get(flow, uid), vizInt(flow, int), [], ())
  | (Num(_), _) =>
    failwith("op Num expected input arity 0, but got " ++ string_of_int(List.length(inputs)))
  | (Add, [x, y]) =>
    hSeq(~uid, ~flow=?Flow.get(flow, uid), ~gap=2., [paren(x), str("+", ()), paren(y)])
  | (Add, _) =>
    str(
      ~uid,
      ~flow=?Flow.get(flow, uid),
      "op Add expected input arity 2, but got " ++ string_of_int(List.length(inputs)),
      (),
    )
  // failwith("op Add expected input arity 2, but got " ++ string_of_int(List.length(inputs)));
  | (Bracket(exp), []) =>
    hSeq(
      ~uid,
      ~flow=?MS.get(flow, uid),
      ~gap=2.,
      [str("{", ()), vizExp(flow, exp), str("}", ())],
    )
  | (Bracket(_), _) =>
    failwith(
      "op Bracket expected input arity 0, but got " ++ string_of_int(List.length(inputs)),
    )
  }

and vizAExp = (flow, aexp: aexp) => vizZExp(vizOp, flow, aexp)

/* TODO: what to do with uid? */
and vizAExps = (flow, (uid, aexps): aexps) =>
  switch (aexps) {
  | Empty => []
  | Cons(aexp, aexps) => [vizAExp(flow, aexp), ...vizAExps(flow, aexps)]
  }

and vizExpOp = (flow, (uid, exp_op): exp_op, inputs: list(Sidewinder.Kernel.node)) =>
  switch (exp_op, inputs) {
  | (Lift(aexp), []) => noop(~uid, ~flow=?Flow.get(flow, uid), vizAExp(flow, aexp), [], ())
  | (Lift(_), _) =>
    failwith("op Lift expected input arity 0, but got " ++ string_of_int(List.length(inputs)))
  | (Let(vid, exp), [ae1]) =>
    vSeq(
      ~uid,
      ~flow=?Flow.get(flow, uid),
      [
        hSeq(~gap=2., [str("let", ()), vizVid(flow, vid), str("=", ()), ae1, str("in", ())]),
        vizExp(flow, exp),
      ],
    )
  | (Let(_), _) =>
    failwith("op Let expected input arity 1, but got " ++ string_of_int(List.length(inputs)))
  }

and vizExp = (flow, exp: exp) => vizZExp(vizOp, flow, exp)

and vizOp = (flow, (uid, op): op, inputs: list(Sidewinder.Kernel.node)) =>
  switch (op) {
  | Exp(exp_op) =>
    noop(~uid, ~flow=?Flow.get(flow, uid), vizExpOp(flow, exp_op, inputs), [], ())
  | AExp(aexp_op) =>
    noop(~uid, ~flow=?Flow.get(flow, uid), vizAExpOp(flow, aexp_op, inputs), [], ())
  }

and vizValue = (flow, (uid, value): value) =>
  switch (value) {
  | VNum(int) =>
    TheiaExtensions.value(~uid, ~flow=?Flow.get(flow, uid), "num", vizInt(flow, int))
  | Clo(lambda, env) =>
    TheiaExtensions.value(
      ~uid,
      ~flow=?Flow.get(flow, uid),
      "closure",
      hSeq([vizLambda(flow, lambda), vizEnv(flow, env)] |> List.map(n => box(n, [], ()))),
    )
  }

/* TODO: what to do with uid? */
and vizValues = (flow, values: values) => {
  /* tail-recursively build list backwards */
  let rec aux = (acc, (uid, values): values) =>
    switch (values) {
    | Empty => acc
    | Cons(value, values) => aux([vizValue(flow, value), ...acc], values)
    };
  aux([], values);
}

and vizBinding = (flow, (uid, {vid, value}): binding) =>
  hSeq(~uid, ~flow=?Flow.get(flow, uid), [vizVid(flow, vid), vizValue(flow, value)])

and vizEnv = (flow, (uid, env): env) =>
  switch (env) {
  | Empty => str(~uid, ~flow=?Flow.get(flow, uid), "empty env", ())
  | Cons(b, env) =>
    vSeq(~uid, ~flow=?Flow.get(flow, uid), [vizEnv(flow, env), vizBinding(flow, b)])
  }

and vizFocus = (flow, (uid, focus): focus) =>
  switch (focus) {
  | ZExp(zeo) => noop(~uid, ~flow=?Flow.get(flow, uid), vizZExp(vizOp, flow, zeo), [], ())
  | ZPreVal(zpvo) =>
    noop(~uid, ~flow=?Flow.get(flow, uid), vizZPreVal(vizOp, flow, zpvo), [], ())
  | Value(value) => noop(~uid, ~flow=?Flow.get(flow, uid), vizValue(flow, value), [], ())
  }

/* TODO: what to do with uid? */
/* threads ctxts through */
/* TODO: might be reversed */
and vizCtxts = (flow, (uid, ctxts): ctxts) =>
  switch (ctxts) {
  | Empty => (x => x)
  | Cons(ctxt, ctxts) => (
      hole => {
        /* TODO: uid for the highlight? */
        let highlightHole = highlight(~fill="hsla(240, 100%, 80%, 33%)", hole, [], ());
        vizCtxts(flow, ctxts, vizZCtxt(vizOp, flow, ctxt, highlightHole));
      }
    )
  }

and vizZipper = (flow, (uid, {focus, ctxts}): zipper) =>
  noop(~uid, ~flow=?Flow.get(flow, uid), vizCtxts(flow, ctxts, vizFocus(flow, focus)), [], ())

and vizFrame = (flow, (uid, {ctxts, env}): frame) =>
  vSeq(~uid, ~flow=?Flow.get(flow, uid), [vizEnv(flow, env), vizCtxts(flow, ctxts, hole)])

and vizStack = (flow, (uid, stack): stack) =>
  switch (stack) {
  | Empty => str(~uid, ~flow=?Flow.get(flow, uid), "empty stack", ())
  | Cons(frame, stack) =>
    vSeq(~uid, ~flow=?Flow.get(flow, uid), [vizStack(flow, stack), vizFrame(flow, frame)])
  };

let vizConfig = (((rule: string, flow: Flow.t), (uid, {zipper, env, stack}): config)) => {
  vSeq(
    ~gap=30.,
    [
      str("rule: " ++ rule, ()),
      hSeq(
        ~uid,
        ~flow=?Flow.get(flow, uid),
        ~gap=20.,
        [vSeq(~gap=5., [vizEnv(flow, env), vizZipper(flow, zipper)]), vizStack(flow, stack)],
      ),
    ],
  );
};