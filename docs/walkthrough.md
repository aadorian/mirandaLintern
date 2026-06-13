# Miranda Walkthrough

A hands-on introduction to Miranda, structured after David Turner's classic article [*An Overview of Miranda*](https://www.cs.kent.ac.uk/people/staff/dat/miranda/Overview.html) (SIGPLAN Notices, December 1986).

Each section links to a runnable example in [`examples/`](../examples/). Open any file in VS Code or Cursor with:

```bash
./scripts/dev.sh --example examples/01-basic-ideas.m
```

> **Note:** This extension provides syntax highlighting and linting only. To evaluate Miranda expressions interactively you need the [Miranda system](http://miranda.org.uk/).

---

## 1. Basic ideas

Miranda is a **purely functional** language. A Miranda program is called a **script** — a collection of equations defining functions and values. Definition order does not matter; a name may be used before it is defined.

Function application uses **juxtaposition** (no parentheses): `sq x` means apply `sq` to `x`.

```miranda
z = sq x / sq y
sq n = n * n
x = a + b
y = a - b
a = 10
b = 5
```

**Lists** use square brackets and commas. Common operators:

| Operator | Meaning |
|----------|---------|
| `++` | append lists |
| `:` | prefix element to list |
| `#` | list length |
| `!` | subscript |
| `--` | list subtraction |
| `..` | arithmetic series |

```miranda
week_days = ["Mon","Tue","Wed","Thur","Fri"]
days = week_days ++ ["Sat","Sun"]
fac n = product [1..n]
```

**Tuples** hold mixed types and use parentheses: `("Jones", True, False, 39)`.

**Try it:** [`examples/01-basic-ideas.m`](../examples/01-basic-ideas.m)

---

## 2. The programming environment

The original Miranda system is **interactive** and runs under UNIX. You type expressions at the terminal; the compiler recompiles scripts after edits and reports syntax or type errors immediately.

With this VS Code extension you get:

- Syntax highlighting for comments, directives, keywords, operators, and types
- ESLint-style linting on type and save
- The command **Miranda: Run Linter**

```bash
npm run dev    # install, test, and open an example file
```

**Try it:** `./scripts/dev.sh` (opens `examples/fib.m` by default)

---

## 3. Guarded equations and block structure

An equation may have **multiple alternatives**, each with a **guard** after a comma:

```miranda
gcd a b = gcd (a-b) b, if a>b
        = gcd a (b-a), if a<b
        = a,           if a=b
```

The last guard may use `otherwise` as a default case.

**Local definitions** use a `where` clause on the right-hand side. Indentation inside `where` blocks is significant (the offside rule):

```miranda
quadsolve a b c = error "complex roots", if delta<0
                = [...], if delta>0
                where
                delta = b*b - 4*a*c
                radix = sqrt delta
```

**Try it:** [`examples/02-guarded-equations.m`](../examples/02-guarded-equations.m)

---

## 4. Pattern matching

Functions can be defined by **several equations** distinguished by **patterns** in the formal parameters — often clearer than guards.

```miranda
fac 0 = 1
fac (n+1) = (n+1) * fac n

mysum [] = 0
mysum (a:x) = a + mysum x
```

List patterns `(a:x)` decompose a non-empty list into head `a` and tail `x`. Tuple elements are extracted the same way: `fst (a,b) = a`.

The library functions `take` and `drop` illustrate pattern matching on numbers and lists:

```miranda
take (n+1) (a:x) = a : take n x
drop (n+1) (a:x) = drop n x
```

**Try it:** [`examples/03-pattern-matching.m`](../examples/03-pattern-matching.m), [`examples/fib.m`](../examples/fib.m)

---

## 5. Currying and higher-order functions

Miranda is **fully higher-order**: functions are first-class values. Application is left-associative, so `f x y` parses as `(f x) y`.

```miranda
twice f x = f (f x)
suc x = x + 1
answer = twice twice twice suc 0
```

Every multi-argument function is really a chain of single-argument functions, enabling **partial application**:

```miranda
vowel = member ['a','e','i','o','u']
digit = member ['0','1','2','3','4','5','6','7','8','9']
```

The `foldr` combinator captures many list operations:

```miranda
myfoldr op k [] = k
myfoldr op k (a:x) = op a (myfoldr op k x)
mysum = myfoldr (+) 0
```

**Try it:** [`examples/04-higher-order.m`](../examples/04-higher-order.m)

---

## 6. List comprehensions

Adapted from set theory notation:

```miranda
[ body | qualifiers ]
```

A **generator** `var <- exp` binds `var` over each element of `exp`. A **filter** is a boolean expression restricting results. Multiple qualifiers are separated by semicolons.

```miranda
squares = [ n*n | n <- [1..100] ]

perms x = [ a:y | a <- x; y <- perms (x--[a]) ]

factors n = [ i | i <- [1..n div 2]; n mod i = 0 ]
```

**Quicksort** in one equation:

```miranda
qsort (a:x) = qsort [ b | b <- x; b<=a ]
              ++ [a] ++
              qsort [ b | b <- x; b>a ]
```

The **eight queens** problem shows comprehensions with filters and recursion:

```miranda
queens (n+1) = [ q:b | b <- queens n; q <- [0..7]; safe q b ]
```

**Try it:** [`examples/05-list-comprehensions.m`](../examples/05-list-comprehensions.m), [`examples/quicksort.m`](../examples/quicksort.m)

---

## 7. Lazy evaluation and infinite lists

Miranda evaluates **lazily**: subexpressions are computed only when needed. This enables **non-strict** functions and **infinite** data structures.

```miranda
cond True x y = x
cond False x y = y
```

Infinite lists:

```miranda
nats = [0..]
primes = sieve [ 2.. ]
         where
         sieve (p:x) = p : sieve [ n | n <- x; n mod p > 0 ]
```

A **lookup table** turns exponential `fib` into linear time:

```miranda
fib (n+2) = flist!(n+1) + flist!n
           where
           flist = map fib [ 0.. ]
```

The **Hamming numbers** problem models communicating processes with infinite streams:

```miranda
hamming = 1 : merge (f 2) (merge (f 3) (f 5))
```

**Try it:** [`examples/06-lazy-infinite-lists.m`](../examples/06-lazy-infinite-lists.m)

---

## 8. Polymorphic strong typing

Miranda is **strongly typed** with compile-time type checking. Primitive types: `num`, `bool`, `char`. Type constructors:

| Form | Example |
|------|---------|
| `[T]` | list of `T` |
| `(T1, T2)` | tuple |
| `T1 -> T2` | function type |

Type declarations use `::` (optional but good documentation):

```miranda
sq :: num -> num
sq n = n * n

id :: * -> *
id x = x
```

The symbols `*`, `**`, `***` are **generic type variables** for polymorphic types.

**Try it:** [`examples/07-polymorphic-types.m`](../examples/07-polymorphic-types.m)

---

## 9. User defined types

Algebraic types are introduced with `::=`:

```miranda
tree * ::= Nilt | Node * (tree *) (tree *)

mirror Nilt = Nilt
mirror (Node a x y) = Node a (mirror y) (mirror x)
```

Constructors must start with an uppercase letter. Enumeration types work the same way:

```miranda
color ::= Red | Orange | Yellow | Green | Blue | Indigo | Violet
```

**Try it:** [`examples/08-user-defined-types.m`](../examples/08-user-defined-types.m)

---

## 10. Type synonyms

New names for existing types use `==` (distinct from value equations):

```miranda
string == [char]
matrix == [[num]]
array * == [[*]]
```

Synonyms are transparent to the typechecker — think of them as macros.

**Try it:** [`examples/09-type-synonyms.m`](../examples/09-type-synonyms.m)

---

## 11. Abstract data types

An **abstract type** hides its representation. Declaration has two parts: a signature (`abstype … with …`) and implementation equations:

```miranda
abstype stack *
with  stack_empty :: stack *
      stack_push :: * -> stack * -> stack *
      stack_top :: stack * -> *

stack * == [*]
stack_empty = []
stack_push a s = (a:s)
stack_top (a:s) = a
```

The original overview uses names like `empty` and `push`; this example prefixes them with `stack_` because `empty` is a Miranda BNF keyword flagged by the linter.

The typechecker treats the abstract type and its representation as the same type inside the implementation, but as unrelated types elsewhere.

**Try it:** [`examples/10-abstract-data-types.m`](../examples/10-abstract-data-types.m)

---

## 12. Separate compilation and linking

Scripts can be split across files using directives:

| Directive | Purpose |
|-----------|---------|
| `%include "file"` | Include another script |
| `%export names` | Control exported names |
| `%free { … }` | Declare parametrised (free) identifiers |

A parametrised matrix package header:

```miranda
%free { element :: type
        zero, unit :: element
        mult, add :: element->element->element
      }
%export matmult determinant
```

Instantiation in the using script:

```miranda
%include "matrix_pack.m"
         { element == num; zero = 0; unit = 1
           mult = *; add = +; subtract = -; divide = /
         }
```

**Try it:** [`examples/modules/matrix_pack.m`](../examples/modules/matrix_pack.m), [`examples/modules/use_matrix.m`](../examples/modules/use_matrix.m)

---

## Example index

| File | Topic |
|------|-------|
| [`01-basic-ideas.m`](../examples/01-basic-ideas.m) | Scripts, lists, tuples, `..` |
| [`02-guarded-equations.m`](../examples/02-guarded-equations.m) | Guards, `where` |
| [`03-pattern-matching.m`](../examples/03-pattern-matching.m) | `fac`, `fib`, `take`/`drop` |
| [`04-higher-order.m`](../examples/04-higher-order.m) | Currying, `foldr` |
| [`05-list-comprehensions.m`](../examples/05-list-comprehensions.m) | Comprehensions, queens |
| [`06-lazy-infinite-lists.m`](../examples/06-lazy-infinite-lists.m) | Lazy streams, sieve, Hamming |
| [`07-polymorphic-types.m`](../examples/07-polymorphic-types.m) | `::` type annotations |
| [`08-user-defined-types.m`](../examples/08-user-defined-types.m) | `::=` algebraic types |
| [`09-type-synonyms.m`](../examples/09-type-synonyms.m) | `==` type synonyms |
| [`10-abstract-data-types.m`](../examples/10-abstract-data-types.m) | `abstype` stacks |
| [`fib.m`](../examples/fib.m) | `take` from official repo |
| [`quicksort.m`](../examples/quicksort.m) | Quicksort from official repo |
| [`modules/matrix_pack.m`](../examples/modules/matrix_pack.m) | `%free` package |
| [`modules/use_matrix.m`](../examples/modules/use_matrix.m) | `%include` consumer |

---

## References

- [An Overview of Miranda](https://www.cs.kent.ac.uk/people/staff/dat/miranda/Overview.html) — David Turner, University of Kent
- [ncihnegn/miranda](https://github.com/ncihnegn/miranda) — open-source implementation
- [miranda.org.uk](http://miranda.org.uk/) — licensing and history
- [garrett-may/miranda-documentation](https://github.com/garrett-may/miranda-documentation) — syntax reference
