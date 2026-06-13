|| Guarded equations and where blocks — Turner overview section 3
|| https://www.cs.kent.ac.uk/people/staff/dat/miranda/Overview.html

gcd a b = gcd (a-b) b, if a>b
        = gcd a (b-a), if a<b
        = a,           if a=b

quadsolve a b c = error "complex roots", if delta<0
                = [-b/(2*a)], if delta=0
                = [-b/(2*a) + radix/(2*a),
                   -b/(2*a) - radix/(2*a)], if delta>0
                where
                delta = b*b - 4*a*c
                radix = sqrt delta

overview_demo = gcd 12 8 ++ quadsolve 1 (-2) 1
