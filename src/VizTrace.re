let leftButtonStyle = ReactDOMRe.Style.make(~borderRadius="4px 0px 0px 4px", ~width="48px", ());
let rightButtonStyle = ReactDOMRe.Style.make(~borderRadius="0px 4px 4px 0px", ~width="48px", ());

/*
 type traceProgress =
   | LoadingTrace
   | ErrorFetchingTrace
   | LoadedTrace(list(FFS.machineState)); */

type state = {
  pos: int,
  length: int,
  prevState: Sidewinder.TransitionNode.state,
  currState: Sidewinder.TransitionNode.state,
};

type action =
  | Increment
  | Decrement
  | Length(int)
  | Toggle
  | Error;

let initialState = {pos: 0, length: 1, prevState: Before, currState: Before};

let toggle = (s: Sidewinder.TransitionNode.state): Sidewinder.TransitionNode.state =>
  switch (s) {
  | Before => After
  | After => Before
  };

let reducer = (state, action) => {
  switch (action) {
  | Increment => {
      ...state,
      pos: min(state.length - 1, state.pos + 1),
      prevState: Before,
      currState: Before,
    }
  | Decrement => {...state, pos: max(0, state.pos - 1), prevState: Before, currState: Before}
  | Length(length) => {...state, length}
  | Toggle => {...state, prevState: state.currState, currState: toggle(state.currState)}
  | Error => state
  };
};

[@react.component]
let make = (~padding=10., ~transition=false, ~program) => {
  let liftedProgram = FFS6.expFromFFS5(program);
  let trace = FFS6Delta.interpretTrace(liftedProgram);

  let (state, dispatch) = React.useReducer(reducer, initialState);

  // Notice that instead of `useEffect`, we have `useEffect0`. See
  // reasonml.github.io/reason-react/docs/en/components#hooks for more info
  React.useEffect0(() => {
    dispatch(Length(List.length(trace)));

    // Returning None, instead of Some(() => ...), means we don't have any
    // cleanup to do before unmounting. That's not 100% true. We should
    // technically cancel the promise. Unofortunately, there's currently no
    // way to cancel a promise. Promises in general should be way less used
    // for React components; but since folks do use them, we provide such an
    // example here. In reality, this fetch should just be a plain callback,
    // with a cancellation API
    None;
  });

  let swTrace = trace |> List.map(FFS6DeltaViz.vizConfig);
  let (sideEffects, _) = trace |> List.split;
  let (_, flows) = sideEffects |> List.split;
  /* |> List.map(Sidewinder.Transform.hide("idStatus"))
     |> List.map((Some(x)) => x)
     |> List.map(Sidewinder.Transform.denest("::", "::")); */
  let initState =
    if (transition) {
      let nextPos = min(state.pos + 1, state.length - 1);
      Sidewinder.Main.renderTransition(
        ~debug=false,
        ~prevState=state.prevState,
        ~currState=state.currState,
        List.nth(swTrace, state.pos),
        List.nth(flows, state.pos),
        List.nth(swTrace, nextPos),
      );
    } else {
      List.nth(swTrace, state.pos) |> Sidewinder.Main.render(~debug=false);
    };
  let width = 1000.;
  let height = 300.;
  let xOffset = 0.;
  let yOffset = 100.;
  /* let width = initState.bbox->Sidewinder.Rectangle.width;
     let height = initState.bbox->Sidewinder.Rectangle.height; */

  /* /* transform is unnecessary b/c top-level always has identity transform b/c parent controls transform */
     let xOffset =
       /* initState.transform.translate.x +.  */ initState.bbox->Sidewinder.Rectangle.x1;
     let yOffset = /* initState.transform.translate.y +. */
     initState.bbox->Sidewinder.Rectangle.y1; */
  <div>
    <div> {React.string("state: ")} {React.string(string_of_int(state.pos))} </div>
    <button style=leftButtonStyle onClick={_event => dispatch(Decrement)}>
      {React.string("<-")}
    </button>
    {if (transition) {
       <button onClick={_event => dispatch(Toggle)}>
         {switch (state.currState) {
          | Before => React.string("To After")
          | After => React.string("To Before")
          }}
       </button>;
     } else {
       <> </>;
     }}
    <button style=rightButtonStyle onClick={_event => dispatch(Increment)}>
      {React.string("->")}
    </button>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={Js.Float.toString(width +. padding *. 2.)}
      height={Js.Float.toString(height +. padding *. 2.)}>
      <g
        transform={
          "translate("
          ++ Js.Float.toString(xOffset +. padding)
          ++ ", "
          ++ Js.Float.toString(yOffset +. padding)
          ++ ")"
        }>
        initState
      </g>
    </svg>
  </div>;
  /* ->Belt.Array.mapWithIndex((i, dog) => {
              let imageStyle =
                ReactDOMRe.Style.make(
                  ~height="120px",
                  ~width="100%",
                  ~marginRight=i === Js.Array.length(dogs) - 1 ? "0px" : "8px",
                  ~borderRadius="8px",
                  ~boxShadow="0px 4px 16px rgb(200, 200, 200)",
                  ~backgroundSize="cover",
                  ~backgroundImage={j|url($dog)|j},
                  ~backgroundPosition="center",
                  (),
                );
              <div key=dog style=imageStyle />;
            })
          ->React.array
        }}
     */
};