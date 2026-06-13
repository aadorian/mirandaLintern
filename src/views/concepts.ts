export interface Concept {
  id: string;
  number: number;
  title: string;
  summary: string;
  body: string;
  codeSample?: string;
  examplePath?: string;
  reference?: string;
}

export const CONCEPTS: Concept[] = [
  {
    id: "basic-ideas",
    number: 1,
    title: "Basic Ideas",
    summary: "Scripts, equations, lists, and tuples",
    body: "Miranda is a purely functional language. Programs are scripts: collections of equations where definition order does not matter. Function application uses juxtaposition (`sq x`), not parentheses.",
    codeSample: "fac n = product [1..n]\nweek_days = [\"Mon\",\"Tue\",\"Wed\"]",
    examplePath: "examples/01-basic-ideas.m",
    reference: "Turner Overview §1",
  },
  {
    id: "environment",
    number: 2,
    title: "Programming Environment",
    summary: "Interactive evaluation and editor workflow",
    body: "The classic Miranda system evaluates expressions interactively and recompiles after edits. This extension provides syntax highlighting, linting on type/save, and the Miranda sidebar for guided learning.",
    examplePath: "examples/fib.m",
    reference: "Turner Overview §2",
  },
  {
    id: "guarded-equations",
    number: 3,
    title: "Guarded Equations",
    summary: "if, otherwise, and where blocks",
    body: "Multiple equation alternatives use guards after a comma. Local definitions use where clauses; indentation inside where is significant (the offside rule).",
    codeSample: "gcd a b = gcd (a-b) b, if a>b\n        = a,           if a=b",
    examplePath: "examples/02-guarded-equations.m",
    reference: "Turner Overview §3",
  },
  {
    id: "pattern-matching",
    number: 4,
    title: "Pattern Matching",
    summary: "Case analysis on numbers, lists, and tuples",
    body: "Functions may be defined by several equations distinguished by patterns in formal parameters. List decomposition `(a:x)` separates head and tail.",
    codeSample: "take (n+1) (a:x) = a : take n x",
    examplePath: "examples/03-pattern-matching.m",
    reference: "Turner Overview §4",
  },
  {
    id: "higher-order",
    number: 5,
    title: "Higher-Order Functions",
    summary: "Currying, partial application, and foldr",
    body: "Functions are first-class values. Application is left-associative, enabling partial application. The foldr combinator captures many list operations.",
    codeSample: "twice f x = f (f x)\nmysum = foldr (+) 0",
    examplePath: "examples/04-higher-order.m",
    reference: "Turner Overview §5",
  },
  {
    id: "comprehensions",
    number: 6,
    title: "List Comprehensions",
    summary: "Generators, filters, and concise iteration",
    body: "Syntax `[ body | qualifiers ]` binds variables over lists and filters results. Quicksort and the eight-queens problem are classic examples.",
    codeSample: "squares = [ n*n | n <- [1..100] ]",
    examplePath: "examples/05-list-comprehensions.m",
    reference: "Turner Overview §6",
  },
  {
    id: "lazy-lists",
    number: 7,
    title: "Lazy Evaluation",
    summary: "Infinite lists, sieve, and streams",
    body: "Lazy evaluation defers computation until values are needed, enabling infinite data structures and non-strict functions like cond.",
    codeSample: "primes = sieve [ 2.. ]\nhamming = 1 : merge (f 2) (f 3)",
    examplePath: "examples/06-lazy-infinite-lists.m",
    reference: "Turner Overview §7",
  },
  {
    id: "types",
    number: 8,
    title: "Polymorphic Typing",
    summary: "Strong types with :: declarations",
    body: "Miranda is strongly typed with compile-time checking. Type declarations use `::`. Generic variables `*`, `**` express polymorphism.",
    codeSample: "sq :: num -> num\nid :: * -> *",
    examplePath: "examples/07-polymorphic-types.m",
    reference: "Turner Overview §8",
  },
  {
    id: "user-types",
    number: 9,
    title: "User-Defined Types",
    summary: "Algebraic types with ::=",
    body: "Algebraic types are introduced with `::=`. Constructors start with an uppercase letter. Pattern matching deconstructs values.",
    codeSample: "tree * ::= Nilt | Node * (tree *) (tree *)",
    examplePath: "examples/08-user-defined-types.m",
    reference: "Turner Overview §9",
  },
  {
    id: "synonyms",
    number: 10,
    title: "Type Synonyms",
    summary: "New names for existing types",
    body: "Type synonyms use `==` and are transparent to the typechecker — think of them as macros for documentation and clarity.",
    codeSample: "string == [char]\nmatrix == [[num]]",
    examplePath: "examples/09-type-synonyms.m",
    reference: "Turner Overview §10",
  },
  {
    id: "abstract-types",
    number: 11,
    title: "Abstract Data Types",
    summary: "Hidden implementations with abstype",
    body: "Abstract types separate a public signature (`abstype … with …`) from implementation equations. The typechecker enforces abstraction boundaries.",
    codeSample: "abstype stack *\nwith stack_empty :: stack *",
    examplePath: "examples/10-abstract-data-types.m",
    reference: "Turner Overview §11",
  },
  {
    id: "modules",
    number: 12,
    title: "Separate Compilation",
    summary: "%include, %export, and %free",
    body: "Scripts split across files using %include, %export, and parametrised %free headers for reusable packages.",
    codeSample: "%include \"matrix_pack.m\" { element == num; ... }",
    examplePath: "examples/modules/use_matrix.m",
    reference: "Turner Overview §12",
  },
];

export function getConceptById(id: string): Concept | undefined {
  return CONCEPTS.find((c) => c.id === id);
}
