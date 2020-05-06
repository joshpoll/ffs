open Jest;
open FFS4;

describe("small examples", () => {
  test("1 + (2 + 3)", () => {
    Expect.(
      expect(Lift(Add(Num(1), Add(Num(2), Num(3)))) |> interpret) |> toEqual(VNum(6))
    )
  });

  test("id app", () => {
    Expect.(
      expect(
        Lift(
          App(Lam({vid: "x", exp: Lift(Var("x"))}), Lam({vid: "y", exp: Lift(Var("y"))})),
        )
        |> interpret,
      )
      |> toEqual(Clo({vid: "y", exp: Lift(Var("y"))}, []))
    )
  });

  test("let add", () => {
    Expect.(
      expect(
        Let("x", Num(5), Let("y", Num(6), Lift(Add(Var("x"), Var("y"))))) |> interpret,
      )
      |> toEqual(VNum(11))
    )
  });
});