|| Parametrised matrix package sketch — Turner overview section 12
|| https://www.cs.kent.ac.uk/people/staff/dat/miranda/Overview.html

%free { element :: type
        zero, unit :: element
        mult, add, subtract, divide :: element->element->element
      }

%export matmult determinant

|| Minimal 1x1 matrix operations using free identifiers
matmult a b = add (mult (a!0!0) (b!0!0)) zero
determinant m = m!0!0
