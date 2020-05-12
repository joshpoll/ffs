/* config types without uids */

type vid = string;

type lambda = {
  vid,
  exp,
}

and aexp =
  | Var(vid)
  | App(aexp, aexp)
  | Lam(lambda)
  | Num(int)
  | Add(aexp, aexp)
  | Bracket(exp)

and exp =
  | Lift(aexp)
  | Let(vid, aexp, exp)

and value =
  | VNum(int)
  | Clo(lambda, env)

and binding = {
  vid,
  value,
}
and env = list(binding);

type hole = unit;

type ctxt =
  | AppL(hole, aexp)
  | AppR(value, hole)
  | LetL(vid, hole, exp)
  | AddL(hole, aexp)
  | AddR(value, hole);

type focus =
  | AExp(aexp)
  | Exp(exp)
  | Value(value);

type ctxts = list(ctxt);

type zipper = {
  focus,
  ctxts,
};

type frame = {
  ctxts,
  env,
};

type stack = list(frame);

type config = {
  zipper,
  env,
  stack,
};