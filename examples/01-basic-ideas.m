|| Basic ideas — adapted from Turner Overview of Miranda
|| https://www.cs.kent.ac.uk/people/staff/dat/miranda/Overview.html

z = sq x / sq y
sq n = n * n
x = a + b
y = a - b
a = 10
b = 5

week_days = ["Mon","Tue","Wed","Thur","Fri"]
days = week_days ++ ["Sat","Sun"]

fac n = product [1..n]
result = sum [1,3..100]

employee = ("Jones", True, False, 39)

overview_demo = z + fac 5 + #days + result + snd employee

--- Tuples

name = fst employee
is_manager = snd employee
is_developer = employee !! 2
age = employee !! 3

--- Lists

-- days is already defined above: week_days ++ ["Sat","Sun"]
-- print days

-- print (days !! 2)


print (drop 3 days)


-- print (length days)
