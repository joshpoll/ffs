open FFS4Delta;
open Sidewinder.Theia;

/* TODO: maybe instead of a single uid, nodes can have multiple uids. but then they wouldn't be UIDs
   but some other construct instead */

/* TODO: ADD FLOW!!!! */

let hSeq = (~uid=?, ~flow=?, ~gap=0., nodes) =>
  seq(~uid?, ~flow?, ~nodes, ~linkRender=None, ~gap, ~direction=LeftRight, ());
let vSeq = (~uid=?, ~flow=?, ~gap=0., nodes) =>
  seq(~uid?, ~flow?, ~nodes, ~linkRender=None, ~gap, ~direction=UpDown, ());
let value = (~uid=?, ~flow=?, name, node) =>
  box(~uid?, ~flow?, ~tags=[name], ~dx=5., ~dy=5., node, [], ());
let cell = (~uid=?, ~flow=?, name, node) =>
  box(~uid?, ~flow?, ~tags=[name], ~dx=5., ~dy=5., node, [], ());
let split = (list, n) => {
  let rec aux = (i, acc) =>
    fun
    | [] => (List.rev(acc), [])
    | [h, ...t] as l =>
      if (i == 0) {
        (List.rev(acc), l);
      } else {
        aux(i - 1, [h, ...acc], t);
      };
  aux(n, [], list);
};
let insert = (x, xs, i) => {
  let (xs, ys) = split(xs, i);
  xs @ [x, ...ys];
};

let kont = (nodeBuilder, nodes, holePos, hole): Sidewinder.Kernel.node =>
  nodeBuilder(insert(hole, nodes, holePos));

let rec zipper = (focus, konts) =>
  switch (konts) {
  | [] => focus
  | [k, ...konts] => k(zipper(focus, konts))
  };

let paren = x => hSeq([str("(", ()), x, str(")", ())]);

let vizVid = ((x_uid, x)) => str(~uid=x_uid, x, ());

let vizInt = ((n_uid, n)) => str(~uid=n_uid, string_of_int(n), ());

/* TODO: this strips away some of the values which are important to the visualization */
let rec envToList = ((e_uid, e): env_uid): list(binding) =>
  switch (e) {
  | Empty => []
  | Env(b, e) => [b, ...envToList(e)]
  };

/* TODO: this also strips things away */
let rec ctxtsToList = ((c_uid, c): ctxts_uid): list(ctxt_uid) =>
  switch (c) {
  | Empty => []
  | Ctxt(c, cs) => [c, ...ctxtsToList(cs)]
  };

let rec vizAExp = ((ae_uid, ae)) =>
  switch (ae) {
  | Var(x) => noop(~uid=ae_uid, vizVid(x), [], ())
  | App(e1, e2) => hSeq(~uid=ae_uid, ~gap=2., [paren(vizAExp(e1)), vizAExp(e2)])
  | Lam(lam) => noop(~uid=ae_uid, vizLambda(lam), [], ())
  | Num(n) => noop(~uid=ae_uid, vizInt(n), [], ())
  | Add(x, y) =>
    hSeq(~uid=ae_uid, ~gap=2., [paren(vizAExp(x)), str("+", ()), paren(vizAExp(y))])
  | Bracket(e) => hSeq(~uid=ae_uid, ~gap=2., [str("{", ()), vizExp(e), str("}", ())])
  }

and vizExp = ((e_uid, e)): Sidewinder.Kernel.node =>
  switch (e) {
  | Lift(ae) => noop(~uid=e_uid, vizAExp(ae), [], ())
  | Let((x_uid, x), ae1, e2) =>
    vSeq(
      ~uid=e_uid,
      [
        hSeq(
          ~gap=2.,
          [
            str("let", ()),
            str(~uid=x_uid, x, ()),
            str("=", ()),
            vizAExp(ae1),
            str("in", ()),
          ],
        ),
        vizExp(e2),
      ],
    )
  }

and vizValue = ((v_uid, v)) =>
  switch (v) {
  | VNum(n) => value(~uid=v_uid, "num", vizInt(n))
  | Clo(lam, e) =>
    value(
      ~uid=v_uid,
      "closure",
      hSeq(List.map(n => box(n, [], ()), [vizLambda(lam), vizEnv(e)])),
    )
  }

and vizEnv = ((e_uid, e)) =>
  table(
    ~uid=e_uid,
    ~nodes=[
      [str("Id", ()), str("Val", ())],
      ...envToList((e_uid, e))
         |> List.map(({vid, value_uid}) => [vizVid(vid), vizValue(value_uid)])
         |> List.rev,
    ],
    ~xLinkRender=
      Some(
        (~source, ~target) =>
          <line
            x1={Js.Float.toString(
              (source->Sidewinder.Rectangle.x2 +. target->Sidewinder.Rectangle.x1) /. 2.,
            )}
            x2={Js.Float.toString(
              (source->Sidewinder.Rectangle.x2 +. target->Sidewinder.Rectangle.x1) /. 2.,
            )}
            y1={Js.Float.toString(
              (source->Sidewinder.Rectangle.y1 +. target->Sidewinder.Rectangle.y1) /. 2.,
            )}
            y2={Js.Float.toString(
              (source->Sidewinder.Rectangle.y2 +. target->Sidewinder.Rectangle.y2) /. 2.,
            )}
            stroke="black"
          />,
      ),
    ~yLinkRender=
      Some(
        (~source, ~target) =>
          <line
            x1={Js.Float.toString(
              (source->Sidewinder.Rectangle.x1 +. target->Sidewinder.Rectangle.x1) /. 2.,
            )}
            x2={Js.Float.toString(
              (source->Sidewinder.Rectangle.x2 +. target->Sidewinder.Rectangle.x2) /. 2.,
            )}
            y1={Js.Float.toString(
              (source->Sidewinder.Rectangle.y2 +. target->Sidewinder.Rectangle.y1) /. 2.,
            )}
            y2={Js.Float.toString(
              (source->Sidewinder.Rectangle.y2 +. target->Sidewinder.Rectangle.y1) /. 2.,
            )}
            stroke="black"
          />,
      ),
    ~xGap=0.,
    ~yGap=0.,
    ~xDirection=LeftRight,
    ~yDirection=UpDown,
    (),
  )

and vizLambda = ({uid, vid, exp_uid}) =>
  hSeq(~uid, [str("\\", ()), vizVid(vid), str(".", ()), vizExp(exp_uid)]);

let vizCtxt = ((c_uid, c)) =>
  switch (c) {
  /* TODO: add parens in the proper places */
  | AppL((), ae) => kont(hSeq(~uid=c_uid, ~gap=2.), [vizAExp(ae)], 0)
  | AppR(v, ()) => kont(hSeq(~uid=c_uid, ~gap=2.), [vizValue(v)], 1)
  | LetL(x, (), e2) => (
      hole => {
        vSeq(
          ~uid=c_uid,
          [
            hSeq(
              ~gap=2.,
              insert(hole, [str("let", ()), vizVid(x), str("=", ()), str("in", ())], 3),
            ),
            vizExp(e2),
          ],
        );
      }
    )
  /* TODO: add parens around hole */
  | AddL((), ae) => kont(hSeq(~uid=c_uid, ~gap=2.), [str("+", ()), paren(vizAExp(ae))], 0)
  | AddR(v, ()) => kont(hSeq(~uid=c_uid, ~gap=2.), [paren(vizValue(v)), str("+", ())], 2)
  };

let vizCtxts = cs => ctxtsToList(cs) |> List.map(vizCtxt);

let hole =
  atom(
    ~links=[],
    <rect fill="red" width="10" height="10" x="5" y="5" />,
    Sidewinder.Rectangle.fromPointSize(~x=0., ~y=0., ~width=10., ~height=10.),
    (),
  );

let vizFocus = ((f_uid, f)) =>
  switch (f) {
  | AExp(ae) => noop(~uid=f_uid, vizAExp(ae), [], ())
  | Exp(e) => noop(~uid=f_uid, vizExp(e), [], ())
  | Value(v) => noop(~uid=f_uid, vizValue(v), [], ())
  };

let vizFrame = ({uid, ctxts_uid, env_uid}) =>
  vSeq(~uid, [vizEnv(env_uid), zipper(hole, vizCtxts(ctxts_uid))]);

/* TODO: strips info */
let rec stackToList = ((s_uid, s): stack_uid): list(frame) =>
  switch (s) {
  | Empty => []
  | Stack(f, s) => [f, ...stackToList(s)]
  };

let vizStack = ((s_uid, fs)) =>
  switch (fs) {
  | Empty => str(~uid=s_uid, " ", ())
  | _ => vSeq(~uid=s_uid, stackToList((s_uid, fs)) |> List.map(vizFrame))
  };

/* TODO: frame_uid is lost */
let vizMachineState = ({uid, focus_uid, frame: {uid: frame_uid, ctxts_uid, env_uid}, stack_uid}) => {
  hSeq(
    ~uid,
    ~gap=20.,
    [
      vSeq(
        ~gap=5.,
        [cell("env", vizEnv(env_uid)), zipper(vizFocus(focus_uid), vizCtxts(ctxts_uid))],
      ),
      cell("stack", vizStack(stack_uid)),
    ],
  );
};