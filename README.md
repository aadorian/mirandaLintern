# Miranda Language Support for VS Code

A Visual Studio Code extension with **syntax highlighting** and **ESLint-style linting** for the [Miranda](https://github.com/ncihnegn/miranda) programming language, the pure functional language designed by David Turner.

Based on:
- [ncihnegn/miranda](https://github.com/ncihnegn/miranda) — official implementation
- [miralib/prelude](https://github.com/ncihnegn/miranda/blob/master/miralib/prelude) — internal prelude
- [garrett-may/miranda-documentation](https://github.com/garrett-may/miranda-documentation) — language documentation

## Features

### Syntax Highlighting
- Comments `||`
- Directives `%include`, `%export`, `%bnf`, etc.
- Reserved words: `if`, `otherwise`, `where`, `abstype`, `with`, `type`, `div`, `mod`
- Literals: `True`, `False`, numbers, strings, chars
- Operators: `::`, `::=`, `==`, `++`, `--`, `<-`, `..`, `\/`, `~`, `&`, etc.
- List comprehensions `[expr | var <- list; filter]`
- Constructors (identifiers starting with an uppercase letter)

### Linter (ESLint-style)
Configurable rules with severity `off` / `warn` / `error`:

| Rule | Description |
|------|-------------|
| `no-trailing-spaces` | No trailing whitespace |
| `require-final-newline` | File must end with a newline |
| `no-tabs` | No tab characters |
| `consistent-indent` | Consistent indentation after `where` (offside rule) |
| `no-duplicate-definitions` | No duplicate top-level definitions |
| `no-undefined-identifier` | Identifiers not defined in scope or standard library |
| `no-unused-definitions` | Unused top-level definitions |
| `boolean-literal-case` | Requires `True`/`False` (not `true`/`false`) |
| `comment-style` | Comments must use `||` |
| `no-single-char-names` | Discourages single-character identifiers |
| `max-line-length` | Maximum line length |
| `unmatched-quotes` | Unmatched quotes |
| `reserved-word-as-identifier` | Reserved words used as identifiers |

## Learn Miranda

### Extension UI

The extension follows [VS Code UX guidelines](https://code.visualstudio.com/api/ux-guidelines/overview) for sidebars, panels, walkthroughs, context menus, and the status bar.

| Surface | What it does |
|---------|----------------|
| **Activity Bar** (λ icon) | **Concepts** — 12 Turner topics with summaries; **Examples** — runnable scripts with descriptions |
| **Panel → Concept Guide** | Themed webview: explanation, code sample, **Open Example**, and **Open Walkthrough** |
| **Panel → Lint Issues** | Lint diagnostics for the active `.m` file; click an issue to jump to the line |
| **Status Bar** (right) | `Miranda` when idle, or `$(error) N $(warning) M` while editing `.m` files |
| **Editor title bar** | Rocket (Start Tutorial), book (Walkthrough), play (Run Linter) |

**Workflow:** open **Concepts** in the sidebar → select a topic → read the explanation in **Concept Guide** → the matching example opens in the editor → check **Lint Issues** while editing.

### Concepts sidebar

Twelve structured topics from David Turner's [An Overview of Miranda](https://www.cs.kent.ac.uk/people/staff/dat/miranda/Overview.html). Each concept includes a summary, prose explanation, code sample, and linked example file.

| # | Concept | Example |
|---|---------|---------|
| 1 | Basic Ideas | `examples/01-basic-ideas.m` |
| 2 | Programming Environment | `examples/fib.m` |
| 3 | Guarded Equations | `examples/02-guarded-equations.m` |
| 4 | Pattern Matching | `examples/03-pattern-matching.m` |
| 5 | Higher-Order Functions | `examples/04-higher-order.m` |
| 6 | List Comprehensions | `examples/05-list-comprehensions.m` |
| 7 | Lazy Evaluation | `examples/06-lazy-infinite-lists.m` |
| 8 | Polymorphic Typing | `examples/07-polymorphic-types.m` |
| 9 | User-Defined Types | `examples/08-user-defined-types.m` |
| 10 | Type Synonyms | `examples/09-type-synonyms.m` |
| 11 | Abstract Data Types | `examples/10-abstract-data-types.m` |
| 12 | Separate Compilation | `examples/modules/use_matrix.m` |

### Commands

All commands are available from the **Command Palette** (`Cmd+Shift+P` / `Ctrl+Shift+P`) under the `Miranda:` prefix.

| Command | Description |
|---------|-------------|
| `Miranda: Start Tutorial` | Opens the basic-ideas example and the Getting Started walkthrough |
| `Miranda: Open Walkthrough` | Opens the VS Code Getting Started walkthrough |
| `Miranda: Show Concept Guide Panel` | Focuses the Concept Guide panel |
| `Miranda: Show Selected Concept in Panel` | Shows the selected Concepts tree item in the panel |
| `Miranda: Show Lint Panel` | Focuses the Lint Issues panel |
| `Miranda: Show Sidebar` | Opens the Miranda Activity Bar sidebar |
| `Miranda: Run Linter` | Lints the active `.m` file |
| `Miranda: Run Linter on File` | Lints a file from the Explorer context menu |
| `Miranda: Run Linter on Selected Example` | Opens and lints an example from the Examples tree |
| `Miranda: Go to Lint Issue` | Jumps to a diagnostic line in the editor |
| `Miranda: Open Example File` | Opens a bundled example by path |
| `Miranda: Open Selected Example` | Opens the selected file in the Examples tree |
| `Miranda: Open Basic Ideas Example` | Walkthrough step: opens `01-basic-ideas.m` |
| `Miranda: Open List Comprehensions Example` | Walkthrough step: opens `05-list-comprehensions.m` |
| `Miranda: Open Fibonacci Example` | Walkthrough step: opens `fib.m` |
| `Miranda: Open Language Guide` | Opens `docs/walkthrough.md` |
| `Miranda: Open Lint Settings` | Opens Miranda lint settings |

### Getting Started walkthrough

After installing the extension, open the **Get Started with Miranda** walkthrough from the VS Code Getting Started page (or run **Help: Get Started**). It guides you through:

1. Opening tutorial `.m` examples
2. Syntax highlighting features
3. Running the linter
4. Pattern matching and list comprehensions
5. Configuring lint rules
6. The full language guide

Walkthroughs follow the [VS Code walkthrough guidelines](https://code.visualstudio.com/api/ux-guidelines/walkthroughs) with theme-aware SVG illustrations and actionable steps.

**Context menus** ([guidelines](https://code.visualstudio.com/api/ux-guidelines/context-menus)) — grouped under a **Miranda** submenu, shown only when relevant:

| Location | When shown | Actions |
|----------|------------|---------|
| Editor right-click | `.m` file open | Learn (tutorial, walkthrough, guide) and Lint (run, panel, settings) |
| Explorer right-click | `.m` file selected | Run linter on file, lint panel, walkthrough, settings |
| Concepts tree | concept selected | Show in Concept Guide panel |
| Examples tree | example file selected | Open example, run linter |
| Lint panel | issue selected | Go to issue |

### Written tutorial

Step-by-step guide based on David Turner's [An Overview of Miranda](https://www.cs.kent.ac.uk/people/staff/dat/miranda/Overview.html):

**[docs/walkthrough.md](docs/walkthrough.md)**

Open any example in the extension dev host:

```bash
./scripts/dev.sh --example examples/01-basic-ideas.m
```

| File | Topic |
|------|-------|
| `examples/01-basic-ideas.m` | Scripts, lists, tuples, `..` |
| `examples/02-guarded-equations.m` | Guards, `where` blocks |
| `examples/03-pattern-matching.m` | `fac`, `fib`, `take`/`drop` |
| `examples/04-higher-order.m` | Currying, partial application, `foldr` |
| `examples/05-list-comprehensions.m` | Comprehensions, quicksort, eight queens |
| `examples/06-lazy-infinite-lists.m` | Lazy streams, sieve, Hamming numbers |
| `examples/07-polymorphic-types.m` | `::` type annotations |
| `examples/08-user-defined-types.m` | `::=` algebraic types |
| `examples/09-type-synonyms.m` | `==` type synonyms |
| `examples/10-abstract-data-types.m` | `abstype` stacks |
| `examples/fib.m` | `take` (official repo) |
| `examples/quicksort.m` | Quicksort (official repo) |
| `examples/modules/matrix_pack.m` | `%free` parametrised package |
| `examples/modules/use_matrix.m` | `%include` consumer |

## Installation

### Local development
```bash
npm install
npm run compile
```

Then in VS Code: **Run Extension** (F5) or install the `.vsix`:

```bash
npx @vscode/vsce package
code --install-extension mirandaCode-0.1.0.vsix
```

### Usage
Open Miranda `.m` files. Syntax highlighting is applied automatically and the linter runs on type or save.

- **Command Palette:** `Miranda: Run Linter`
- **Sidebar:** click the λ icon → **Concepts** or **Examples**
- **Panel:** **Concept Guide** for explanations, **Lint Issues** for diagnostics

## Configuration

In VS Code `settings.json`:

```json
{
  "miranda.lint.enable": true,
  "miranda.lint.run": "onTypeAndSave",
  "miranda.lint.maxLineLength": 80,
  "miranda.lint.indentSize": 1,
  "miranda.lint.rules.booleanLiteralCase": "error",
  "miranda.lint.rules.noUndefinedIdentifier": "warn"
}
```

You can also use `.mirandarc.json` in the project root as a configuration reference.

## Testing

Unit test suite with **Mocha + Chai** (linter and provider) and **vscode-tmgrammar-test** (syntax highlighting):

```bash
npm test              # linter, config, diagnostics, provider, constants, examples, views
npm run test:grammar  # 6 tests: TextMate grammar
npm run test:all      # runs both suites (122 tests)
```

### Quick development (install + test + open VS Code)

```bash
chmod +x scripts/dev.sh   # first time only
npm run dev               # install, test, open extension dev host
npm run guide             # open dev host with walkthrough (skip tests)
```

The `scripts/dev.sh` script:
1. Runs `npm install`
2. Runs `npm run test:all` (unless `--skip-tests`)
3. Opens VS Code or Cursor with `--extensionDevelopmentPath` and `examples/fib.m`

Useful options:

```bash
./scripts/dev.sh --example examples/quicksort.m
./scripts/dev.sh --walkthrough              # also open Getting Started walkthrough
./scripts/dev.sh --walkthrough --example examples/01-basic-ideas.m
./scripts/dev.sh --skip-tests               # compile and open only
./scripts/dev.sh --skip-launch              # install and test only
./scripts/dev.sh --install-vsix             # also package and install the .vsix
```

### Coverage

| Suite | Files | What it verifies |
|-------|-------|------------------|
| Linter | `src/test/linter.test.ts` | All 13 rules + `examples/` fixtures |
| Examples | `src/test/examples.test.ts` | All `examples/**/*.m` lint-clean (no errors) |
| Views | `src/test/views/*.test.ts` | Concepts catalog, examples manifest, lint panel formatting |
| Config | `src/test/config.test.ts` | `buildLintConfig` and overrides |
| Diagnostics | `src/test/diagnostics.test.ts` | Severity mapping and ranges |
| Provider | `src/test/provider.test.ts` | Diagnostic publishing in VS Code |
| Grammar | `src/test/grammar/*.test.m` | Scopes for comments, keywords, operators, literals, comprehensions, directives |

## Examples

The `examples/` folder contains tutorial scripts adapted from [Turner's overview](https://www.cs.kent.ac.uk/people/staff/dat/miranda/Overview.html), plus samples from the official repository. See [docs/walkthrough.md](docs/walkthrough.md) for a guided tour.

## References

- [An Overview of Miranda](https://www.cs.kent.ac.uk/people/staff/dat/miranda/Overview.html) — David Turner, University of Kent
- [miranda.org.uk](http://miranda.org.uk/)
- [Operators and lexical notation](https://github.com/garrett-may/miranda-documentation/tree/master/syntax)

## License

This extension code is free to use. Miranda is © Research Software Limited / David Turner.
