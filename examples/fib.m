|| Fibonacci — pattern matching example from the official Miranda repo
take 0 x = []
take (n+1) [] = []
take (n+1) (a:x) = a : take n x

