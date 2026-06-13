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
