/* open FFS5Delta;
   open Sidewinder.Theia;

   /* TODO: maybe instead of a single uid, nodes can have multiple uids. but then they wouldn't be UIDs
      but some other construct instead. unsure exactly why I might need this. */

   /* TODO: threading flow through every function, would be better e.g. refactor into a functor */

   module MS = Belt.Map.String;

   let hSeq = (~uid=?, ~flow=?, ~gap=0., nodes) =>
     seq(~uid?, ~flow?, ~nodes, ~linkRender=None, ~gap, ~direction=LeftRight, ());
   let vSeq = (~uid=?, ~flow=?, ~gap=0., nodes) =>
     seq(~uid?, ~flow?, ~nodes, ~linkRender=None, ~gap, ~direction=UpDown, ());
   let value = (~uid=?, ~flow=?, name, node) =>
     box(~uid?, ~flow?, ~tags=[name], ~dx=5., ~dy=5., node, [], ());
   let cell = (~uid=?, ~flow=?, name, node) =>
     box(~uid?, ~flow?, ~tags=[name], ~dx=5., ~dy=5., node, [], ());

   let empty = (~uid=?, ~flow=?, ()) =>
     atom(
       ~uid?,
       ~flow?,
       <> </>,
       Sidewinder.Rectangle.fromCenterPointSize(~cx=0., ~cy=0., ~width=0., ~height=0.),
       (),
     );

   let highlight = (~uid=?, ~flow=?, ~tags=[], ~fill, node, links, ()) => {
     open Sidewinder;
     let render = (nodes, bbox, links) => {
       <>
         <rect
           x={Js.Float.toString(bbox->Rectangle.x1)}
           y={Js.Float.toString(bbox->Rectangle.y1)}
           width={Js.Float.toString(bbox->Rectangle.width)}
           height={Js.Float.toString(bbox->Rectangle.height)}
           fill
         />
         {defaultRender(nodes, links)}
       </>;
     };
     Main.make(
       ~uid?,
       ~flow?,
       ~tags=["highlight", ...tags],
       ~nodes=[node],
       ~links,
       ~layout=(_, bboxes, _) => MS.map(bboxes, _ => Transform.ident),
       ~computeBBox=bs => bs->MS.valuesToArray->Array.to_list->Rectangle.union_list,
       ~render,
       (),
     );
   };

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
     nodeBuilder(
       insert(highlight(~fill="hsla(240, 100%, 80%, 33%)", hole, [], ()), nodes, holePos),
     );

   let rec zipper_aux = (focus, konts) =>
     switch (konts) {
     | [] => focus
     | [k, ...konts] => k(zipper_aux(focus, konts))
     };

   let zipper = (~uid=?, ~flow=?, focus, konts) =>
     noop(~uid?, ~flow?, zipper_aux(focus, konts), [], ());

   let paren = x => hSeq([str("(", ()), x, str(")", ())]);

   let vizVid = (flow, (x_uid, x)) => str(~uid=x_uid, ~flow=?Flow.get(flow, x_uid), x, ());

   let vizInt = (flow, (n_uid, n)) =>
     str(~uid=n_uid, ~flow=?Flow.get(flow, n_uid), string_of_int(n), ());

   /* TODO: this strips away some of the values which are important to the visualization */
   /* the visualization actually crashes, because it expects a value that isn't there!!!! */
   /* need to make a row-based table layout. for now can fake with a vseq of hseqs. the only downside
      will be the table will be jagged. that's why a new primitive is necessary */
   /* let rec envToList = ((e_uid, e): env_uid): list(binding) =>
      switch (e) {
      | Empty => []
      | Env(b, e) => [b, ...envToList(e)]
      }; */

   /* TODO: this also strips things away */
   let rec ctxtsToList = ((c_uid, c): ctxts_uid): list(ctxt_uid) =>
     switch (c) {
     | Empty => []
     | Ctxt(c, cs) => [c, ...ctxtsToList(cs)]
     };

   let rec vizAExp = (flow, (ae_uid, ae)) =>
     switch (ae) {
     | Var(x) => noop(~uid=ae_uid, ~flow=?Flow.get(flow, ae_uid), vizVid(flow, x), [], ())
     | App(e1, e2) =>
       hSeq(
         ~uid=ae_uid,
         ~flow=?Flow.get(flow, ae_uid),
         ~gap=2.,
         [paren(vizAExp(flow, e1)), vizAExp(flow, e2)],
       )
     | Lam(lam) => noop(~uid=ae_uid, ~flow=?Flow.get(flow, ae_uid), vizLambda(flow, lam), [], ())
     | Num(n) => noop(~uid=ae_uid, ~flow=?Flow.get(flow, ae_uid), vizInt(flow, n), [], ())
     | Add(x, y) =>
       hSeq(
         ~uid=ae_uid,
         ~flow=?Flow.get(flow, ae_uid),
         ~gap=2.,
         [paren(vizAExp(flow, x)), str("+", ()), paren(vizAExp(flow, y))],
       )
     | Bracket(e) =>
       hSeq(
         ~uid=ae_uid,
         ~flow=?Flow.get(flow, ae_uid),
         ~gap=2.,
         [str("{", ()), vizExp(flow, e), str("}", ())],
       )
     }

   and vizExp = (flow, (e_uid, e)): Sidewinder.Kernel.node =>
     switch (e) {
     | Lift(ae) => noop(~uid=e_uid, ~flow=?Flow.get(flow, e_uid), vizAExp(flow, ae), [], ())
     | Let(x, ae1, e2) =>
       vSeq(
         ~uid=e_uid,
         ~flow=?Flow.get(flow, e_uid),
         [
           hSeq(
             ~gap=2.,
             [str("let", ()), vizVid(flow, x), str("=", ()), vizAExp(flow, ae1), str("in", ())],
           ),
           vizExp(flow, e2),
         ],
       )
     }

   and vizValue = (flow, (v_uid, v)) =>
     switch (v) {
     | VNum(n) => value(~uid=v_uid, ~flow=?Flow.get(flow, v_uid), "num", vizInt(flow, n))
     | Clo(lam, e) =>
       value(
         ~uid=v_uid,
         ~flow=?Flow.get(flow, v_uid),
         "closure",
         hSeq(List.map(n => box(n, [], ()), [vizLambda(flow, lam), vizEnv(flow, e)])),
       )
     }

   /* TODO: this visualization is hacky, but it should allow for more continuity */
   and vizBinding = (flow, {uid, vid, value_uid}) =>
     hSeq(~uid, ~flow=?Flow.get(flow, uid), [vizVid(flow, vid), vizValue(flow, value_uid)])

   and vizEnvAux = (flow, (e_uid, e: env)) =>
     switch (e) {
     | Empty => empty(~uid=e_uid, ~flow=?Flow.get(flow, e_uid), ())
     | Env(b, e) =>
       vSeq(~uid=e_uid, ~flow=?Flow.get(flow, e_uid), [vizEnvAux(flow, e), vizBinding(flow, b)])
     }

   and vizEnv = (flow, (e_uid, e)) =>
     switch (e) {
     | Empty => str(~uid=e_uid, ~flow=?Flow.get(flow, e_uid), "empty env", ())
     | _ => vizEnvAux(flow, (e_uid, e))
     }

   /* table(
        ~uid=e_uid,
        ~flow=?Flow.get(flow, e_uid),
        ~nodes=[
          [str("Id", ()), str("Val", ())],
          ...envToList((e_uid, e))
             |> List.map(({vid, value_uid}) => [vizVid(flow, vid), vizValue(flow, value_uid)])
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
      ) */

   and vizLambda = (flow, {uid, vid, exp_uid}) =>
     hSeq(
       ~uid,
       ~flow=?Flow.get(flow, uid),
       [str("\\", ()), vizVid(flow, vid), str(".", ()), vizExp(flow, exp_uid)],
     );

   let vizCtxt = (flow, (c_uid, c)) =>
     switch (c) {
     /* TODO: add parens in the proper places */
     | AppL((), ae) =>
       kont(hSeq(~uid=c_uid, ~flow=?Flow.get(flow, c_uid), ~gap=2.), [vizAExp(flow, ae)], 0)
     | AppR(v, ()) =>
       kont(hSeq(~uid=c_uid, ~flow=?Flow.get(flow, c_uid), ~gap=2.), [vizValue(flow, v)], 1)
     | LetL(x, (), e2) => (
         hole => {
           vSeq(
             ~uid=c_uid,
             ~flow=?Flow.get(flow, c_uid),
             [
               hSeq(
                 ~gap=2.,
                 insert(
                   /* TODO: this extra use of highlight hints that insert should be responsible for highlighting */
                   highlight(~fill="hsla(240, 100%, 80%, 33%)", hole, [], ()),
                   [str("let", ()), vizVid(flow, x), str("=", ()), str("in", ())],
                   3,
                 ),
               ),
               vizExp(flow, e2),
             ],
           );
         }
       )
     /* TODO: add parens around hole */
     | AddL((), ae) =>
       kont(
         hSeq(~uid=c_uid, ~flow=?Flow.get(flow, c_uid), ~gap=2.),
         [str("+", ()), paren(vizAExp(flow, ae))],
         0,
       )
     | AddR(v, ()) =>
       kont(
         hSeq(~uid=c_uid, ~flow=?Flow.get(flow, c_uid), ~gap=2.),
         [paren(vizValue(flow, v)), str("+", ())],
         2,
       )
     };

   let vizCtxts = (flow, cs) => ctxtsToList(cs) |> List.map(vizCtxt(flow));

   let hole =
     atom(
       ~links=[],
       <rect fill="red" width="10" height="10" x="5" y="5" />,
       Sidewinder.Rectangle.fromPointSize(~x=0., ~y=0., ~width=10., ~height=10.),
       (),
     );

   let vizFocus = (flow, (f_uid, f)) =>
     switch (f) {
     | AExp(ae) => noop(~uid=f_uid, ~flow=?Flow.get(flow, f_uid), vizAExp(flow, ae), [], ())
     | Exp(e) => noop(~uid=f_uid, ~flow=?Flow.get(flow, f_uid), vizExp(flow, e), [], ())
     | Value(v) => noop(~uid=f_uid, ~flow=?Flow.get(flow, f_uid), vizValue(flow, v), [], ())
     };

   let vizFrame = (flow, {uid, ctxts_uid, env_uid}) =>
     vSeq(
       ~uid,
       ~flow=?Flow.get(flow, uid),
       [vizEnv(flow, env_uid), zipper(hole, vizCtxts(flow, ctxts_uid))],
     );

   /* TODO: strips info */
   /* let rec stackToList = ((s_uid, s): stack_uid): list(frame) =>
      switch (s) {
      | Empty => []
      | Stack(f, s) => [f, ...stackToList(s)]
      }; */

   let rec vizStack = (flow, (s_uid, fs)) =>
     box(
       ~uid=s_uid,
       ~flow=?Flow.get(flow, s_uid),
       ~dx=5.,
       ~dy=5.,
       switch (fs) {
       | Empty => str("empty stack", ())
       | Stack(f, fs) => vSeq([vizStack(flow, fs), vizFrame(flow, f)])
       },
       [],
       (),
     );

   /* let vizStack = (flow, (s_uid, fs)) =>
      switch (fs) {
      | Empty => str(~uid=s_uid, ~flow=?Flow.get(flow, s_uid), "empty stack", ())
      | _ => vizStackAux(flow, (s_uid, fs))
      }; */

   let vizMachineState =
       (
         (
           (rule: string, flow: FFS5Delta.flow),
           {uid, zipper: {uid: z_uid, focus_uid, ctxts_uid}, env_uid, stack_uid},
         ),
       ) => {
     vSeq(
       ~gap=30.,
       [
         str("rule: " ++ rule, ()),
         hSeq(
           ~uid,
           ~flow=?Flow.get(flow, uid),
           ~gap=20.,
           [
             vSeq(
               ~gap=5.,
               [
                 cell("env", vizEnv(flow, env_uid)),
                 zipper(
                   ~uid=z_uid,
                   ~flow=?Flow.get(flow, z_uid),
                   vizFocus(flow, focus_uid),
                   vizCtxts(flow, ctxts_uid),
                 ),
               ],
             ),
             vizStack(flow, stack_uid),
           ],
         ),
       ],
     );
   }; */