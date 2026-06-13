export interface ExampleEntry {
  id: string;
  label: string;
  path: string;
  group: string;
}

export const EXAMPLE_GROUPS: { id: string; label: string }[] = [
  { id: "tutorial", label: "Tutorial" },
  { id: "official", label: "Official Repo" },
  { id: "modules", label: "Modules" },
];

export const EXAMPLE_ENTRIES: ExampleEntry[] = [
  { id: "01", label: "01 — Basic ideas", path: "examples/01-basic-ideas.m", group: "tutorial" },
  { id: "02", label: "02 — Guarded equations", path: "examples/02-guarded-equations.m", group: "tutorial" },
  { id: "03", label: "03 — Pattern matching", path: "examples/03-pattern-matching.m", group: "tutorial" },
  { id: "04", label: "04 — Higher-order functions", path: "examples/04-higher-order.m", group: "tutorial" },
  { id: "05", label: "05 — List comprehensions", path: "examples/05-list-comprehensions.m", group: "tutorial" },
  { id: "06", label: "06 — Lazy infinite lists", path: "examples/06-lazy-infinite-lists.m", group: "tutorial" },
  { id: "07", label: "07 — Polymorphic types", path: "examples/07-polymorphic-types.m", group: "tutorial" },
  { id: "08", label: "08 — User-defined types", path: "examples/08-user-defined-types.m", group: "tutorial" },
  { id: "09", label: "09 — Type synonyms", path: "examples/09-type-synonyms.m", group: "tutorial" },
  { id: "10", label: "10 — Abstract data types", path: "examples/10-abstract-data-types.m", group: "tutorial" },
  { id: "fib", label: "fib.m — take", path: "examples/fib.m", group: "official" },
  { id: "quicksort", label: "quicksort.m", path: "examples/quicksort.m", group: "official" },
  { id: "matrix-pack", label: "matrix_pack.m", path: "examples/modules/matrix_pack.m", group: "modules" },
  { id: "use-matrix", label: "use_matrix.m", path: "examples/modules/use_matrix.m", group: "modules" },
];

export function getExamplesForGroup(groupId: string): ExampleEntry[] {
  return EXAMPLE_ENTRIES.filter((entry) => entry.group === groupId);
}

export function getExampleById(id: string): ExampleEntry | undefined {
  return EXAMPLE_ENTRIES.find((entry) => entry.id === id);
}
