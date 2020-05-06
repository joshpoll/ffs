open FFS;
open Sidewinder.Theia;

let hSeq = (~gap=0., nodes) => seq(~nodes, ~linkRender=None, ~gap, ~direction=LeftRight, ());
let vSeq = (~gap=0., nodes) => seq(~nodes, ~linkRender=None, ~gap, ~direction=UpDown, ());
let value = (name, node) => box(~tags=[name], ~dx=5., ~dy=5., node, [], ());
let cell = (name, node) => box(~tags=[name], ~dx=5., ~dy=5., node, [], ());
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

let rec vizExpr = e =>
  switch (e) {
  | Var(x) => str(x, ())
  | App(e1, e2) =>
    hSeq(~gap=2., [hSeq([str("(", ()), vizExpr(e1), str(")", ())]), vizExpr(e2)])
  | Lam(lam) => vizLambda(lam)
  | Val(v) => vizValue(v)
  }

and vizValue = v =>
  switch (v) {
  | Clo(lam, e) =>
    value("closure", hSeq(List.map(n => box(n, [], ()), [vizLambda(lam), vizEnv(e)])))
  }

and vizEnv = e =>
  table(
    ~nodes=[
      [str("Id", ()), str("Val", ())],
      ...List.map(({id, value}) => [str(id, ()), vizValue(value)], e),
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

and vizLambda = ({id, expr}) => hSeq([str("\\" ++ id ++ ".", ()), vizExpr(expr)]);

let vizCtxt = c =>
  switch (c) {
  | AppL((), e) => kont(hSeq, [vizExpr(e)], 0)
  | AppR(v, ()) => kont(hSeq, [vizValue(v)], 1)
  };

let vizCtxts = List.map(vizCtxt);

let hole =
  atom(
    ~links=[],
    <rect fill="red" width="10" height="10" x="5" y="5" />,
    Sidewinder.Rectangle.fromPointSize(~x=0., ~y=0., ~width=10., ~height=10.),
    (),
  );

let vizFocus = vizExpr;

let vizFrame = ({ctxts, env}) => vSeq([vizEnv(env), zipper(hole, vizCtxts(ctxts))]);

let vizStack = fs =>
  switch (fs) {
  | [] => str(" ", ())
  | _ => vSeq(List.map(vizFrame, fs))
  };

let vizMachineState = ({focus, frame: {ctxts, env}, stack}) => {
  hSeq(
    ~gap=20.,
    [
      vSeq(~gap=5., [cell("env", vizEnv(env)), zipper(vizFocus(focus), vizCtxts(ctxts))]),
      cell("stack", vizStack(stack)),
    ],
  );
};