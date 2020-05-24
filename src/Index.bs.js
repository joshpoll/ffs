'use strict';

var $$Array = require("bs-platform/lib/js/array.js");
var Block = require("bs-platform/lib/js/block.js");
var React = require("react");
var ReactDom = require("react-dom");
var FFS6$ReasonReactExamples = require("./FFS6.bs.js");
var VizTrace$ReasonReactExamples = require("./VizTrace.bs.js");
var ExampleStyles$ReasonReactExamples = require("./ExampleStyles.bs.js");
var BlinkingGreeting$ReasonReactExamples = require("./BlinkingGreeting/BlinkingGreeting.bs.js");
var FetchedDogPictures$ReasonReactExamples = require("./FetchedDogPictures/FetchedDogPictures.bs.js");
var ReducerFromReactJSDocs$ReasonReactExamples = require("./ReducerFromReactJSDocs/ReducerFromReactJSDocs.bs.js");
var ReasonUsingJSUsingReason$ReasonReactExamples = require("./ReasonUsingJSUsingReason/ReasonUsingJSUsingReason.bs.js");

var style = document.createElement("style");

document.head.appendChild(style);

style.innerHTML = ExampleStyles$ReasonReactExamples.style;

function makeContainer(text) {
  var container = document.createElement("div");
  container.className = "container";
  var title = document.createElement("div");
  title.className = "containerTitle";
  title.innerText = text;
  var content = document.createElement("div");
  content.className = "containerContent";
  container.appendChild(title);
  container.appendChild(content);
  document.body.appendChild(container);
  return content;
}

ReactDom.render(React.createElement(BlinkingGreeting$ReasonReactExamples.make, {
          children: "Hello!"
        }), makeContainer("Blinking Greeting"));

ReactDom.render(React.createElement(ReducerFromReactJSDocs$ReasonReactExamples.make, { }), makeContainer("Reducer From ReactJS Docs"));

ReactDom.render(React.createElement(FetchedDogPictures$ReasonReactExamples.make, { }), makeContainer("Fetched Dog Pictures"));

ReactDom.render(React.createElement(ReasonUsingJSUsingReason$ReasonReactExamples.make, { }), makeContainer("Reason Using JS Using Reason"));

function id(x) {
  return /* Lam */Block.__(2, [{
              vid: x,
              exp: /* Lift */Block.__(0, [/* Var */Block.__(0, [x])])
            }]);
}

ReactDom.render(React.createElement(VizTrace$ReasonReactExamples.make, {
          program: /* Lift */Block.__(0, [/* Num */Block.__(3, [5])])
        }), makeContainer("5"));

console.log("interpret trace: 5", $$Array.of_list(FFS6$ReasonReactExamples.interpretTrace(FFS6$ReasonReactExamples.expFromFFS5(/* Lift */Block.__(0, [/* Num */Block.__(3, [5])])))));

ReactDom.render(React.createElement(VizTrace$ReasonReactExamples.make, {
          program: /* Lift */Block.__(0, [/* App */Block.__(1, [
                  /* Lam */Block.__(2, [{
                        vid: "x",
                        exp: /* Lift */Block.__(0, [/* Var */Block.__(0, ["x"])])
                      }]),
                  /* Lam */Block.__(2, [{
                        vid: "y",
                        exp: /* Lift */Block.__(0, [/* Var */Block.__(0, ["y"])])
                      }])
                ])])
        }), makeContainer("app(id, id)"));

ReactDom.render(React.createElement(VizTrace$ReasonReactExamples.make, {
          program: /* Lift */Block.__(0, [/* Add */Block.__(4, [
                  /* Num */Block.__(3, [1]),
                  /* Add */Block.__(4, [
                      /* Num */Block.__(3, [2]),
                      /* Num */Block.__(3, [3])
                    ])
                ])])
        }), makeContainer("1 + (2 + 3)"));

console.log("interpret trace: 1 + (2 + 3)", $$Array.of_list(FFS6$ReasonReactExamples.interpretTrace(FFS6$ReasonReactExamples.expFromFFS5(/* Lift */Block.__(0, [/* Add */Block.__(4, [
                        /* Num */Block.__(3, [1]),
                        /* Add */Block.__(4, [
                            /* Num */Block.__(3, [2]),
                            /* Num */Block.__(3, [3])
                          ])
                      ])])))));

ReactDom.render(React.createElement(VizTrace$ReasonReactExamples.make, {
          program: /* Let */Block.__(1, [
              "x",
              /* Num */Block.__(3, [5]),
              /* Let */Block.__(1, [
                  "y",
                  /* Num */Block.__(3, [6]),
                  /* Lift */Block.__(0, [/* Add */Block.__(4, [
                          /* Var */Block.__(0, ["x"]),
                          /* Var */Block.__(0, ["y"])
                        ])])
                ])
            ])
        }), makeContainer("let add"));

ReactDom.render(React.createElement(VizTrace$ReasonReactExamples.make, {
          transition: true,
          program: /* Let */Block.__(1, [
              "x",
              /* Num */Block.__(3, [5]),
              /* Let */Block.__(1, [
                  "y",
                  /* Num */Block.__(3, [6]),
                  /* Lift */Block.__(0, [/* Add */Block.__(4, [
                          /* Var */Block.__(0, ["x"]),
                          /* Var */Block.__(0, ["y"])
                        ])])
                ])
            ])
        }), makeContainer("let add transition"));

ReactDom.render(React.createElement(VizTrace$ReasonReactExamples.make, {
          transition: true,
          program: /* Lift */Block.__(0, [/* App */Block.__(1, [
                  /* Lam */Block.__(2, [{
                        vid: "x",
                        exp: /* Lift */Block.__(0, [/* Var */Block.__(0, ["x"])])
                      }]),
                  /* Lam */Block.__(2, [{
                        vid: "y",
                        exp: /* Lift */Block.__(0, [/* Var */Block.__(0, ["y"])])
                      }])
                ])])
        }), makeContainer("id id transition"));

ReactDom.render(React.createElement(VizTrace$ReasonReactExamples.make, {
          transition: true,
          program: /* Let */Block.__(1, [
              "x",
              /* Num */Block.__(3, [34]),
              /* Let */Block.__(1, [
                  "y",
                  /* Num */Block.__(3, [17]),
                  /* Let */Block.__(1, [
                      "z",
                      /* Add */Block.__(4, [
                          /* Add */Block.__(4, [
                              /* Var */Block.__(0, ["x"]),
                              /* Var */Block.__(0, ["y"])
                            ]),
                          /* Add */Block.__(4, [
                              /* Var */Block.__(0, ["y"]),
                              /* Num */Block.__(3, [2])
                            ])
                        ]),
                      /* Lift */Block.__(0, [/* Add */Block.__(4, [
                              /* Var */Block.__(0, ["z"]),
                              /* Num */Block.__(3, [1])
                            ])])
                    ])
                ])
            ])
        }), makeContainer("lecture 1"));

ReactDom.render(React.createElement(VizTrace$ReasonReactExamples.make, {
          transition: true,
          program: /* Let */Block.__(1, [
              "a",
              /* Num */Block.__(3, [1]),
              /* Let */Block.__(1, [
                  "b",
                  /* Add */Block.__(4, [
                      /* Num */Block.__(3, [2]),
                      /* Var */Block.__(0, ["a"])
                    ]),
                  /* Let */Block.__(1, [
                      "a",
                      /* Num */Block.__(3, [3]),
                      /* Lift */Block.__(0, [/* Add */Block.__(4, [
                              /* Var */Block.__(0, ["a"]),
                              /* Var */Block.__(0, ["b"])
                            ])])
                    ])
                ])
            ])
        }), makeContainer("section 1"));

ReactDom.render(React.createElement(VizTrace$ReasonReactExamples.make, {
          transition: true,
          program: /* Let */Block.__(1, [
              "x",
              /* Num */Block.__(3, [5]),
              /* Lift */Block.__(0, [/* Add */Block.__(4, [
                      /* App */Block.__(1, [
                          /* Lam */Block.__(2, [{
                                vid: "y",
                                exp: /* Lift */Block.__(0, [/* Var */Block.__(0, ["y"])])
                              }]),
                          /* Var */Block.__(0, ["x"])
                        ]),
                      /* Num */Block.__(3, [1])
                    ])])
            ])
        }), makeContainer("demo"));

exports.style = style;
exports.makeContainer = makeContainer;
exports.id = id;
/* style Not a pure module */
