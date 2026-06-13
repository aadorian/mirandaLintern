|| Lazy evaluation and infinite lists — Turner overview section 7
|| https://www.cs.kent.ac.uk/people/staff/dat/miranda/Overview.html

cond True x y = x
cond False x y = y

ones = 1 : ones
nats = [0..]
odds = [1,3..]

squares_inf = [ n*n | n <- nats ]

primes = sieve [ 2.. ]
         where
         sieve (p:x) = p : sieve [ n | n <- x; n mod p > 0 ]

fib 0 = 1
fib 1 = 1
fib (n+2) = flist!(n+1) + flist!n
           where
           flist = map fib [ 0.. ]

hamming = 1 : merge (f 2) (merge (f 3) (f 5))
          where
          f a = [ n*a | n <- hamming ]
          merge (a:x) (b:y) = a : merge x (b:y), if a<b
                            = b : merge (a:x) y, if a>b
                            = a : merge x y, otherwise

overview_demo = take 5 hamming ++ take 10 primes ++ cond True 0 1
