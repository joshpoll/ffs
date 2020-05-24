open Sidewinder.Theia;

let hSeq = (~uid=?, ~flowTag=?, ~gap=0., nodes) =>
  seq(~uid?, ~flowTag?, ~nodes, ~linkRender=None, ~gap, ~direction=LeftRight, ());
let vSeq = (~uid=?, ~flowTag=?, ~gap=0., nodes) =>
  seq(~uid?, ~flowTag?, ~nodes, ~linkRender=None, ~gap, ~direction=UpDown, ());
let value = (~uid=?, ~flowTag=?, name, node) =>
  box(~uid?, ~flowTag?, ~tags=[name], ~dx=5., ~dy=5., node, [], ());
let cell = (~uid=?, ~flowTag=?, name, node) =>
  box(~uid?, ~flowTag?, ~tags=[name], ~dx=5., ~dy=5., node, [], ());

let empty = (~uid=?, ~flowTag=?, ()) =>
  atom(
    ~uid?,
    ~flowTag?,
    <> </>,
    Sidewinder.Rectangle.fromCenterPointSize(~cx=0., ~cy=0., ~width=0., ~height=0.),
    (),
  );

let highlight = (~uid=?, ~flowTag=?, ~tags=[], ~fill, node, links, ()) => {
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
    ~flowTag?,
    ~tags=["highlight", ...tags],
    ~nodes=[node],
    ~links,
    ~layout=(_, bboxes, _) => MS.map(bboxes, _ => Transform.ident),
    ~computeBBox=bs => bs->MS.valuesToArray->Array.to_list->Rectangle.union_list,
    ~render,
    (),
  );
};

let paren = x => hSeq([str("(", ()), x, str(")", ())]);

let hole =
  atom(
    ~links=[],
    <rect fill="none" width="10" height="10" x="5" y="5" />,
    Sidewinder.Rectangle.fromPointSize(~x=0., ~y=0., ~width=10., ~height=10.),
    (),
  );