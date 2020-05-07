'use strict';

var List = require("bs-platform/lib/js/list.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Caml_primitive = require("bs-platform/lib/js/caml_primitive.js");
var LCA$Sidewinder = require("sidewinder/src/LCA.bs.js");
var Debug$Sidewinder = require("sidewinder/src/Debug.bs.js");
var Layout$Sidewinder = require("sidewinder/src/Layout.bs.js");
var Render$Sidewinder = require("sidewinder/src/Render.bs.js");
var RenderLinks$Sidewinder = require("sidewinder/src/RenderLinks.bs.js");
var FFS4Delta$ReasonReactExamples = require("./FFS4Delta.bs.js");
var FFS4DeltaViz$ReasonReactExamples = require("./FFS4DeltaViz.bs.js");

var leftButtonStyle = {
  width: "48px",
  borderRadius: "4px 0px 0px 4px"
};

var rightButtonStyle = {
  width: "48px",
  borderRadius: "0px 4px 4px 0px"
};

function render($staropt$star, n) {
  var debug = $staropt$star !== undefined ? $staropt$star : false;
  return Render$Sidewinder.render(RenderLinks$Sidewinder.renderLinks(Layout$Sidewinder.computeBBoxes(LCA$Sidewinder.fromKernel((
                            debug ? Debug$Sidewinder.transform : (function (x) {
                                  return x;
                                })
                          )(n)))));
}

var initialState_trace = /* :: */[
  FFS4Delta$ReasonReactExamples.loading,
  /* [] */0
];

var initialState = {
  pos: 0,
  trace: initialState_trace
};

function reducer(state, action) {
  if (typeof action === "number") {
    switch (action) {
      case /* Increment */0 :
          return {
                  pos: Caml_primitive.caml_int_min(List.length(state.trace) - 1 | 0, state.pos + 1 | 0),
                  trace: state.trace
                };
      case /* Decrement */1 :
          return {
                  pos: Caml_primitive.caml_int_max(0, state.pos - 1 | 0),
                  trace: state.trace
                };
      case /* Error */2 :
          return state;
      
    }
  } else {
    return {
            pos: state.pos,
            trace: action[0]
          };
  }
}

function VizTrace(Props) {
  var match = Props.padding;
  var padding = match !== undefined ? match : 10;
  var program = Props.program;
  var match$1 = React.useReducer(reducer, initialState);
  var dispatch = match$1[1];
  var state = match$1[0];
  React.useEffect((function () {
          Curry._1(dispatch, /* Trace */[FFS4Delta$ReasonReactExamples.interpretTrace(program)]);
          return ;
        }), ([]));
  var trace = state.trace;
  var swTrace = List.map(FFS4DeltaViz$ReasonReactExamples.vizMachineState, trace);
  var initState = render(false, List.nth(swTrace, state.pos));
  return React.createElement("div", undefined, React.createElement("div", undefined, "state: ", String(state.pos)), React.createElement("button", {
                  style: leftButtonStyle,
                  onClick: (function (_event) {
                      return Curry._1(dispatch, /* Decrement */1);
                    })
                }, "<-"), React.createElement("button", {
                  style: rightButtonStyle,
                  onClick: (function (_event) {
                      return Curry._1(dispatch, /* Increment */0);
                    })
                }, "->"), React.createElement("svg", {
                  height: (300 + padding * 2).toString(),
                  width: (1000 + padding * 2).toString(),
                  xmlns: "http://www.w3.org/2000/svg"
                }, React.createElement("g", {
                      transform: "translate(" + ((0 + padding).toString() + (", " + ((100 + padding).toString() + ")")))
                    }, initState)));
}

var make = VizTrace;

exports.leftButtonStyle = leftButtonStyle;
exports.rightButtonStyle = rightButtonStyle;
exports.render = render;
exports.initialState = initialState;
exports.reducer = reducer;
exports.make = make;
/* react Not a pure module */
