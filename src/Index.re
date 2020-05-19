// Entry point

[@bs.val] external document: Js.t({..}) = "document";

// We're using raw DOM manipulations here, to avoid making you read
// ReasonReact when you might precisely be trying to learn it for the first
// time through the examples later.
let style = document##createElement("style");
document##head##appendChild(style);
style##innerHTML #= ExampleStyles.style;

let makeContainer = text => {
  let container = document##createElement("div");
  container##className #= "container";

  let title = document##createElement("div");
  title##className #= "containerTitle";
  title##innerText #= text;

  let content = document##createElement("div");
  content##className #= "containerContent";

  let () = container##appendChild(title);
  let () = container##appendChild(content);
  let () = document##body##appendChild(container);

  content;
};

// All 4 examples.
ReactDOMRe.render(
  <BlinkingGreeting> {React.string("Hello!")} </BlinkingGreeting>,
  makeContainer("Blinking Greeting"),
);

ReactDOMRe.render(<ReducerFromReactJSDocs />, makeContainer("Reducer From ReactJS Docs"));

ReactDOMRe.render(<FetchedDogPictures />, makeContainer("Fetched Dog Pictures"));

ReactDOMRe.render(<ReasonUsingJSUsingReason />, makeContainer("Reason Using JS Using Reason"));

let id = x => FFS5.Lam({vid: x, exp: Lift(Var(x))});

ReactDOMRe.render(<VizTrace program={FFS5.Lift(Num(5))} />, makeContainer("5"));
Js.log2(
  "interpret trace: 5",
  FFS6.interpretTrace(FFS5.Lift(Num(5)) |> FFS6.expFromFFS5) |> Array.of_list,
);

/* TODO: crashes! */
/* ReactDOMRe.render(
     <VizTrace program={FFS5.Lift(App(id("x"), id("y")))} />,
     makeContainer("app(id, id)"),
   );
    */
/* TODO: moves numbers around for some reason */
ReactDOMRe.render(
  <VizTrace program={FFS5.Lift(Add(Num(1), Add(Num(2), Num(3))))} />,
  makeContainer("1 + (2 + 3)"),
);
Js.log2(
  "interpret trace: 1 + (2 + 3)",
  FFS6.interpretTrace(FFS5.Lift(Add(Num(1), Add(Num(2), Num(3)))) |> FFS6.expFromFFS5)
  |> Array.of_list,
);

ReactDOMRe.render(
  <VizTrace
    program={FFS5.Let("x", Num(5), Let("y", Num(6), Lift(Add(Var("x"), Var("y")))))}
  />,
  makeContainer("let add"),
);

/*    ReactDOMRe.render(
        <VizTrace
          program={FFS5.Let("x", Num(5), Let("y", Num(6), Lift(Add(Var("x"), Var("y")))))}
          transition=true
        />,
        makeContainer("let add transition"),
      );

      ReactDOMRe.render(
        <VizTrace program={FFS5.Lift(App(id("x"), id("y")))} transition=true />,
        makeContainer("id id transition"),
      ); */