'use strict';

var Jest = require("@glennsl/bs-jest/src/jest.js");
var Block = require("bs-platform/lib/js/block.js");
var FFS4$ReasonReactExamples = require("../src/FFS4.bs.js");

Jest.describe("small examples", (function (param) {
        Jest.test("1 + (2 + 3)", (function (param) {
                return Jest.Expect.toEqual(/* VNum */Block.__(0, [6]), Jest.Expect.expect(FFS4$ReasonReactExamples.interpret(/* Lift */Block.__(0, [/* Add */Block.__(4, [
                                          /* Num */Block.__(3, [1]),
                                          /* Add */Block.__(4, [
                                              /* Num */Block.__(3, [2]),
                                              /* Num */Block.__(3, [3])
                                            ])
                                        ])]))));
              }));
        Jest.test("id app", (function (param) {
                return Jest.Expect.toEqual(/* Clo */Block.__(1, [
                              {
                                vid: "y",
                                exp: /* Lift */Block.__(0, [/* Var */Block.__(0, ["y"])])
                              },
                              /* [] */0
                            ]), Jest.Expect.expect(FFS4$ReasonReactExamples.interpret(/* Lift */Block.__(0, [/* App */Block.__(1, [
                                          /* Lam */Block.__(2, [{
                                                vid: "x",
                                                exp: /* Lift */Block.__(0, [/* Var */Block.__(0, ["x"])])
                                              }]),
                                          /* Lam */Block.__(2, [{
                                                vid: "y",
                                                exp: /* Lift */Block.__(0, [/* Var */Block.__(0, ["y"])])
                                              }])
                                        ])]))));
              }));
        return Jest.test("let add", (function (param) {
                      return Jest.Expect.toEqual(/* VNum */Block.__(0, [11]), Jest.Expect.expect(FFS4$ReasonReactExamples.interpret(/* Let */Block.__(1, [
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
                                          ]))));
                    }));
      }));

/*  Not a pure module */
