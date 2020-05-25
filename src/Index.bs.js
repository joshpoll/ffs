'use strict';

var Block = require("bs-platform/lib/js/block.js");
var React = require("react");
var ReactDom = require("react-dom");
var VizTrace$ReasonReactExamples = require("./VizTrace.bs.js");
var ExampleStyles$ReasonReactExamples = require("./ExampleStyles.bs.js");

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

function id(x) {
  return /* Lam */Block.__(2, [{
              vid: x,
              exp: /* Lift */Block.__(0, [/* Var */Block.__(0, [x])])
            }]);
}

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
        }), makeContainer("Demo. See state 17."));

ReactDom.render(React.createElement(React.Fragment, undefined, React.createElement("div", undefined, "Inspired by ", React.createElement("a", {
                  href: "https://www.youtube.com/watch?v=_vJ1PlF_oxA&feature=youtu.be&t=357",
                  target: "_blank"
                }, "Lecture 1 of UW's Programming Languages Course.")), React.createElement(VizTrace$ReasonReactExamples.make, {
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
            })), makeContainer("Lecture 1: ML Variable Bindings and Expressions"));

ReactDom.render(React.createElement(React.Fragment, undefined, React.createElement("div", undefined, "Inspired by ", React.createElement("a", {
                  href: "https://courses.cs.washington.edu/courses/cse341/20sp/files/section/sec01/sec01-slides.pdf",
                  target: "_blank"
                }, "Section 1 of UW's Programming Languages Course.")), React.createElement(VizTrace$ReasonReactExamples.make, {
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
            })), makeContainer("Section 1: Shadowing"));

exports.style = style;
exports.makeContainer = makeContainer;
exports.id = id;
/* style Not a pure module */
