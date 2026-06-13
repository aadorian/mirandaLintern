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

## Installation

### Local development
```bash
npm install
npm run compile
```

Then in VS Code: **Run Extension** (F5) or install the `.vsix`:

```bash
npx @vscode/vsce package
code --install-extension miranda-0.1.0.vsix
```

### Usage
Open Miranda `.m` files. Syntax highlighting is applied automatically and the linter runs on type or save.

Manual command: `Miranda: Run Linter`

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
npm test              # 48 tests: linter, config, diagnostics, provider
npm run test:grammar  # 6 tests: TextMate grammar
npm run test:all      # runs both suites
```

### Quick development (install + test + open VS Code)

```bash
chmod +x scripts/dev.sh   # first time only
npm run dev
```

The `scripts/dev.sh` script:
1. Runs `npm install`
2. Runs `npm run test:all`
3. Opens VS Code or Cursor with `--extensionDevelopmentPath` and `examples/fib.m`

Useful options:

```bash
./scripts/dev.sh --example examples/quicksort.m
./scripts/dev.sh --skip-tests          # compile and open only
./scripts/dev.sh --skip-launch         # install and test only
./scripts/dev.sh --install-vsix        # also package and install the .vsix
```

### Coverage

| Suite | Files | What it verifies |
|-------|-------|------------------|
| Linter | `src/test/linter.test.ts` | All 13 rules + `examples/` fixtures |
| Config | `src/test/config.test.ts` | `buildLintConfig` and overrides |
| Diagnostics | `src/test/diagnostics.test.ts` | Severity mapping and ranges |
| Provider | `src/test/provider.test.ts` | Diagnostic publishing in VS Code |
| Grammar | `src/test/grammar/*.test.m` | Scopes for comments, keywords, operators, literals, comprehensions, directives |

## Examples

The `examples/` folder contains scripts from the official repository:
- `fib.m` — Fibonacci numbers
- `quicksort.m` — functional quicksort

## References

- [Miranda on Wikipedia](https://en.wikipedia.org/wiki/Miranda_(programming_language))
- [miranda.org.uk](http://miranda.org.uk/)
- [Operators and lexical notation](https://github.com/garrett-may/miranda-documentation/tree/master/syntax)

## License

This extension code is free to use. Miranda is © Research Software Limited / David Turner.
