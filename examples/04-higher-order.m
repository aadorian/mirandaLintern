|| Currying and higher-order functions — Turner overview section 5
|| https://www.cs.kent.ac.uk/people/staff/dat/miranda/Overview.html

twice f x = f (f x)
suc x = x + 1

answer = twice twice twice suc 0

vowel = member ['a','e','i','o','u']
digit = member ['0','1','2','3','4','5','6','7','8','9']

myfoldr op k [] = k
myfoldr op k (a:x) = op a (myfoldr op k x)

mysum = myfoldr (+) 0
myproduct = myfoldr (*) 1

overview_demo = answer + mysum [1,2,3] + if vowel 'a' then 1 else 0
