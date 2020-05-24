/* module MS = Belt.Map.String;
   type t = MS.t(list(UID.uid));

   let merge = (m1: MS.t(list('a)), m2: MS.t(list('a))) => {
     MS.merge(m1, m2, (_, mv1, mv2) =>
       switch (mv1, mv2) {
       | (None, None) => None
       | (Some(v1), None) => Some(v1)
       | (None, Some(v2)) => Some(v2)
       | (Some(v1), Some(v2)) => Some(v1 @ v2)
       }
     );
   };

   let fromArray = MS.fromArray;

   let toArray = MS.toArray;

   let none = MS.empty;

   let get = (flow, uid): option(Sidewinder.Flow.t) =>
     switch (MS.get(flow, uid)) {
     | None => None
     | Some(flow) => Some(Flow(flow))
     }; */