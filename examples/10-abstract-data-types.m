|| Abstract data types — Turner overview section 11
|| https://www.cs.kent.ac.uk/people/staff/dat/miranda/Overview.html

abstype stack *
with  stack_empty :: stack *
      stack_isempty :: stack * -> bool
      stack_push :: * -> stack * -> stack *
      stack_pop :: stack * -> stack *
      stack_top :: stack * -> *

stack * == [*]
stack_empty = []
stack_isempty s = (s=[])
stack_push a s = (a:s)
stack_pop (a:s) = s
stack_top (a:s) = a

overview_demo = stack_top (stack_push 1 (stack_push 2 stack_empty))
