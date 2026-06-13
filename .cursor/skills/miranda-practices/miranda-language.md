# Miranda Language Best Practices

Guidance for `.m` scripts in this project, aligned with David Turner's [Overview](https://www.cs.kent.ac.uk/people/staff/dat/miranda/Overview.html) and the extension linter.

## Script structure

- A Miranda **script** is a set of top-level equations; definition order does not matter
- Group related definitions; use `||` comments and `--- Section` headers for tutorials
- One binding per name at top level (the linter enforces `no-duplicate-definitions`)
- In multi-section tutorials, **reuse** earlier bindings instead of redefining `employee`, `days`, etc.

## Naming and identifiers

| Practice | Example |
|----------|---------|
| Functions and values: lowercase | `fac`, `week_days`, `mysum` |
| Algebraic constructors: uppercase initial | `Nilt`, `Node` |
| Booleans: `True`, `False` | never `true` / `false` |
| Type variables in declarations | `*`, `**` in `id :: * -> *` |
| Avoid reserved words as names | `if`, `where`, `type`, `empty`, `error` |
| Single-char names | discouraged by linter when rule enabled; `x`, `n`, `f` are conventional |

Standard library identifiers (e.g. `map`, `foldr`, `take`, `product`, `fst`, `snd`) are predefined — see `src/linter/constants.ts`.

## Comments and formatting

```miranda
|| This is a Miranda comment — always use ||
--- Optional section marker for tutorials
```

- No `//` or `#` line comments
- Default max line length: 80 (`miranda.lint.maxLineLength`)
- Spaces only; no tab characters
- File must end with a final newline
- No trailing whitespace on lines

## Function definition styles

### Juxtaposition (application)

```miranda
sq n = n * n
z = sq x / sq y
```

### Guards

```miranda
gcd a b = gcd (a-b) b, if a>b
        = a,           if a=b
```

- Align guard alternatives for readability
- Last guard may use `otherwise`
- Indentation after `where` is significant (offside rule)

### Pattern matching (preferred when structure matters)

```miranda
fac 0 = 1
fac (n+1) = (n+1) * fac n

take (n+1) (a:x) = a : take n x
take 0 x = []
```

## Lists, tuples, and operators

| Construct | Syntax | Notes |
|-----------|--------|-------|
| List | `[1,2,3]` | homogeneous sequences |
| Cons | `a : x` | prefix element |
| Append | `xs ++ ys` | |
| Length | `#xs` | |
| Index | `xs !! n` | |
| Range | `[1..n]`, `[1,3..100]` | |
| Comprehension | `[ e \| v <- xs; p ]` | generators and filters |
| Tuple | `(a,b,c)` | mixed types |
| Projection | `fst`, `snd`, `!!` | |

## Types and modules

```miranda
|| Polymorphic annotation
sq :: num -> num

|| Algebraic type
tree * ::= Nilt | Node * (tree *) (tree *)

|| Type synonym
string == [char]

|| Abstract type
abstype stack *
with
  stack_empty :: stack *
```

**Separate compilation**

```miranda
%include "matrix_pack.m" { element == num; ... }
%export fac, sq
%free element, rows, cols
```

Place module examples under `examples/modules/`.

## Higher-order and lazy patterns

```miranda
twice f x = f (f x)
mysum = foldr (+) 0

primes = sieve [2..]
take 10 primes
```

- Prefer `foldr`, `map`, `filter` over manual recursion when clear
- Infinite lists are valid with lazy evaluation; document intent in comments

## Tutorial examples in this repo

| File | Topic |
|------|-------|
| `01-basic-ideas.m` | Scripts, lists, tuples, `..` |
| `02-guarded-equations.m` | Guards, `where` |
| `03-pattern-matching.m` | `fac`, `take`, `drop` |
| `04-higher-order.m` | Currying, `foldr` |
| `05-list-comprehensions.m` | Comprehensions, quicksort |
| `06-lazy-infinite-lists.m` | Streams, sieve |
| `07-polymorphic-types.m` | `::` annotations |
| `08-user-defined-types.m` | `::=` types |
| `09-type-synonyms.m` | `==` synonyms |
| `10-abstract-data-types.m` | `abstype` |
| `modules/use_matrix.m` | `%include` consumer |

New examples must:

1. Pass all lint rules at error severity
2. Map to a Concepts sidebar topic when educational
3. Include a `||` header citing Turner overview when adapted
4. Stay runnable as a script (avoid duplicate top-level names across sections)

## Common lint fixes

| Issue | Fix |
|-------|-----|
| `no-duplicate-definitions` | Rename or remove repeat binding; reuse earlier name |
| `boolean-literal-case` | Change `true` → `True`, `false` → `False` |
| `comment-style` | Change `//` → `||` |
| `consistent-indent` | Align `where` body; match `indentSize` (default 1) |
| `unmatched-quotes` | Close string/char quotes; escape inner quotes |
| `no-undefined-identifier` | Define name, import via `%include`, or use prelude fn |
| `reserved-word-as-identifier` | Rename binding (e.g. `stack_empty` not `empty`) |

## Verification

```bash
npm run test:all          # includes examples lint regression
./scripts/dev.sh --example examples/01-basic-ideas.m
```

In VS Code: **Miranda: Run Linter** on the active `.m` file.

## Extension integration

When adding language content:

- Register example path in `src/views/examplesTree.ts` with `description`
- Add matching `Concept` in `src/views/concepts.ts` if it is a Turner topic
- Update `docs/walkthrough.md` and `README.md` tables
- Run `src/test/examples.test.ts` — it fails if any bundled example has lint errors
