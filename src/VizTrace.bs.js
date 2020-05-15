'use strict';

var List = require("bs-platform/lib/js/list.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Caml_primitive = require("bs-platform/lib/js/caml_primitive.js");
var Main$Sidewinder = require("sidewinder/src/Main.bs.js");
var FFS5Delta$ReasonReactExamples = require("./FFS5Delta.bs.js");
var FFS5DeltaViz$ReasonReactExamples = require("./FFS5DeltaViz.bs.js");

var leftButtonStyle = {
  width: "48px",
  borderRadius: "4px 0px 0px 4px"
};

var rightButtonStyle = {
  width: "48px",
  borderRadius: "0px 4px 4px 0px"
};

var initialState = {
  pos: 0,
  length: 1,
  prevState: /* Before */0,
  currState: /* Before */0
};

function toggle(s) {
  if (s) {
    return /* Before */0;
  } else {
    return /* After */1;
  }
}

function reducer(state, action) {
  if (typeof action === "number") {
    switch (action) {
      case /* Increment */0 :
          return {
                  pos: Caml_primitive.caml_int_min(state.length - 1 | 0, state.pos + 1 | 0),
                  length: state.length,
                  prevState: /* Before */0,
                  currState: /* Before */0
                };
      case /* Decrement */1 :
          return {
                  pos: Caml_primitive.caml_int_max(0, state.pos - 1 | 0),
                  length: state.length,
                  prevState: /* Before */0,
                  currState: /* Before */0
                };
      case /* Toggle */2 :
          return {
                  pos: state.pos,
                  length: state.length,
                  prevState: state.currState,
                  currState: state.currState ? /* Before */0 : /* After */1
                };
      case /* Error */3 :
          return state;
      
    }
  } else {
    return {
            pos: state.pos,
            length: action[0],
            prevState: state.prevState,
            currState: state.currState
          };
  }
}

function VizTrace(Props) {
  var match = Props.padding;
  var padding = match !== undefined ? match : 10;
  var match$1 = Props.transition;
  var transition = match$1 !== undefined ? match$1 : false;
  var program = Props.program;
  var trace = FFS5Delta$ReasonReactExamples.interpretTrace(program);
  var match$2 = React.useReducer(reducer, initialState);
  var dispatch = match$2[1];
  var state = match$2[0];
  React.useEffect((function () {
          Curry._1(dispatch, /* Length */[List.length(trace)]);
          return ;
        }), ([]));
  var swTrace = List.map(FFS5DeltaViz$ReasonReactExamples.vizMachineState, trace);
  var initState;
  if (transition) {
    var nextPos = Caml_primitive.caml_int_min(state.pos + 1 | 0, state.length - 1 | 0);
    initState = Main$Sidewinder.renderTransition(false, state.prevState, state.currState, List.nth(swTrace, state.pos), List.nth(swTrace, nextPos));
  } else {
    initState = Main$Sidewinder.render(false, List.nth(swTrace, state.pos));
  }
  var tmp;
  if (transition) {
    var match$3 = state.currState;
    tmp = React.createElement("button", {
          onClick: (function (_event) {
              return Curry._1(dispatch, /* Toggle */2);
            })
        }, match$3 ? "To Before" : "To After");
  } else {
    tmp = React.createElement(React.Fragment, undefined);
  }
  return React.createElement("div", undefined, React.createElement("div", undefined, "state: ", String(state.pos)), React.createElement("button", {
                  style: leftButtonStyle,
                  onClick: (function (_event) {
                      return Curry._1(dispatch, /* Decrement */1);
                    })
                }, "<-"), tmp, React.createElement("button", {
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
exports.toggle = toggle;
exports.reducer = reducer;
exports.make = make;
/* react Not a pure module */
