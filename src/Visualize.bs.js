'use strict';

var React = require("react");
var Main$Sidewinder = require("sidewinder/src/Main.bs.js");

function Visualize(Props) {
  var node = Props.node;
  var width = Props.width;
  var height = Props.height;
  Main$Sidewinder.debugLCA(node);
  return React.createElement("svg", {
              height: height.toString(),
              width: width.toString(),
              xmlns: "http://www.w3.org/2000/svg"
            }, React.createElement("g", {
                  transform: "translate(" + ((width / 2).toString() + (", " + ((height / 2).toString() + ")")))
                }, Main$Sidewinder.render(undefined, node)));
}

var make = Visualize;

exports.make = make;
/* react Not a pure module */
