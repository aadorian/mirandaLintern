|| Pattern matching — Turner overview section 4
|| https://www.cs.kent.ac.uk/people/staff/dat/miranda/Overview.html

fac 0 = 1
fac (n+1) = (n+1) * fac n

fib 0 = 0
fib 1 = 1
fib (n+2) = fib (n+1) + fib n

mysum [] = 0
mysum (a:x) = a + mysum x

myproduct [] = 1
myproduct (a:x) = a * myproduct x

myreverse [] = []
myreverse (a:x) = myreverse x ++ [a]

ack 0 n = n+1
ack (m+1) 0 = ack m 1
ack (m+1) (n+1) = ack m (ack (m+1) n)

take 0 x = []
take (n+1) [] = []
take (n+1) (a:x) = a : take n x

drop 0 x = x
drop (n+1) [] = []
drop (n+1) (a:x) = drop n x

overview_demo = fac 5 + fib 8 + mysum [1,2,3] + #myreverse [1,2]
