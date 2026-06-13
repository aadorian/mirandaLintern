|| List comprehensions — Turner overview section 6
|| https://www.cs.kent.ac.uk/people/staff/dat/miranda/Overview.html

squares = [ n*n | n <- [1..100] ]

perms [] = [[]]
perms x = [ a:y | a <- x; y <- perms (x--[a]) ]

factors n = [ i | i <- [1..n div 2]; n mod i = 0 ]

qsort [] = []
qsort (a:x) = qsort [ b | b <- x; b<=a ]
              ++ [a] ++
              qsort [ b | b <- x; b>a ]

queens 0 = [[]]
queens (n+1) = [ q:b | b <- queens n; q <- [0..7]; safe q b ]
safe q b = and [ ~checks q b i | i <- [0..#b-1] ]
checks q b i = q=b!i \/ abs(q - b!i)=i+1

overview_demo = take 5 squares ++ qsort [3,1,4] ++ take 1 (queens 8)
