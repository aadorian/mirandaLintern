|| Functional quicksort — list comprehension example from the official repo

qsort [] = []
qsort (a:x) = qsort [b | b<-x; b<=a] ++ [a] ++ qsort [b | b<-x; b>a]

testdata = f 10
f n = concat (transpose [[0,2..2*n], [2*n-1,2*n-3..1]])
