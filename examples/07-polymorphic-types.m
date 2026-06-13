|| Polymorphic strong typing — Turner overview section 8
|| https://www.cs.kent.ac.uk/people/staff/dat/miranda/Overview.html

sq :: num -> num
sq n = n * n

id :: * -> *
id x = x

fac :: num -> num
fac n = product [1..n]

reverse_ann :: [*] -> [*]
reverse_ann = foldr postfix []
              where
              postfix a x = x ++ [a]

overview_demo = sq 3 + fac 4 + #reverse_ann (id [1,2,3])
