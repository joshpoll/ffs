'use strict';

var List = require("bs-platform/lib/js/list.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Caml_primitive = require("bs-platform/lib/js/caml_primitive.js");
var Main$Sidewinder = require("sidewinder/src/Main.bs.js");
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
  var match$1 = Props.transition;
  var transition = match$1 !== undefined ? match$1 : false;
  var program = Props.program;
  var match$2 = React.useReducer(reducer, initialState);
  var dispatch = match$2[1];
  var state = match$2[0];
  React.useEffect((function () {
          Curry._1(dispatch, /* Trace */[FFS4Delta$ReasonReactExamples.interpretTrace(program)]);
          return ;
        }), ([]));
  var trace = state.trace;
  var swTrace = List.map(FFS4DeltaViz$ReasonReactExamples.vizMachineState, trace);
  var initState;
  if (transition) {
    var nextPos = Caml_primitive.caml_int_min(state.pos + 1 | 0, List.length(state.trace) - 1 | 0);
    initState = Main$Sidewinder.renderTransition(false, List.nth(swTrace, state.pos), List.nth(swTrace, nextPos));
  } else {
    initState = Main$Sidewinder.render(false, List.nth(swTrace, state.pos));
  }
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
exports.initialState = initialState;
exports.reducer = reducer;
exports.make = make;
/* react Not a pure module */
