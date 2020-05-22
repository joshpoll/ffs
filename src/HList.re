type t =
  | []: t
  | ::(('a, t)): t;