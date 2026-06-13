---
name: miranda-practices
description: >-
  Conventional commit conventions and Miranda language best practices for the
  mirandaSintaxHighligh VS Code extension. Use when writing commit messages,
  reviewing git changes, authoring or linting Miranda .m scripts, adding examples,
  or extending the extension.
---

# Miranda Practices

Project standards for **conventional commits** and **Miranda** code in this repository.

## When to apply

- User asks to commit, push, or write a PR
- User adds or edits `examples/**/*.m` or Miranda scripts
- User changes linter rules, grammar, views, or extension UI
- User asks for Miranda style, lint fixes, or language guidance

## Quick workflows

### Commit workflow

1. Run `git status`, `git diff`, and `git log -5 --oneline` in parallel
2. Run `npm run test:all` if code, examples, grammar, or views changed
3. Draft message using [conventional-commits.md](conventional-commits.md)
4. Stage only relevant files; never commit secrets (`.env`, credentials)
5. Commit only when the user explicitly asks
6. Push only when the user explicitly asks

### Miranda code workflow

1. Follow [miranda-language.md](miranda-language.md) for scripts and examples
2. Ensure `examples/**/*.m` have **no error-severity** lint issues
3. Prefer pattern matching and comprehensions over imperative-style guards when clearer
4. Link new tutorial content to Turner overview sections when possible

### Extension change workflow

1. Match existing patterns in `src/views/`, `src/linter/`, `package.json`
2. UI changes follow [VS Code UX guidelines](https://code.visualstudio.com/api/ux-guidelines/overview)
3. Add or update tests in `src/test/` for behavior changes
4. Update `README.md` when commands, views, or workflows change

## Commit format (summary)

```
<type>(<scope>): <imperative subject>

Optional body explaining why, not just what.
```

**Project defaults**

| Field | Value |
|-------|-------|
| Type | `feat`, `fix`, `docs`, `test`, `refactor`, `chore` |
| Scope | `extension`, `linter`, `grammar`, `views`, `examples`, `docs`, `tests` |
| Subject | ≤72 chars, lowercase, imperative, no trailing period |
| Body | 1–3 sentences; focus on *why* |

**Real commits from this repo**

```
feat(extension): add Miranda language support for VS Code
feat(extension): add walkthrough, tutorial examples, and onboarding UI
feat(extension): add activity bar, panel views, and context menus
feat(extension): add Concepts sidebar and Concept Guide panel
```

## Miranda lint rules (summary)

All `examples/**/*.m` must pass with **zero errors**. Default severities in `src/linter/constants.ts`:

| Rule | Default | Practice |
|------|---------|----------|
| `consistent-indent` | error | Respect offside rule in `where` blocks |
| `no-duplicate-definitions` | error | One top-level equation per name |
| `boolean-literal-case` | error | `True` / `False`, never `true` / `false` |
| `reserved-word-as-identifier` | error | Avoid `if`, `where`, `type`, etc. as names |
| `unmatched-quotes` | error | Balance `"` and `'` in strings/chars |
| `no-undefined-identifier` | warn | Use prelude/stdlib names or define locally |
| `comment-style` | warn | Use `||` for comments |
| `max-line-length` | warn | Default 80 columns |
| `require-final-newline` | warn | End files with a newline |

Run linter: `Miranda: Run Linter` or `npm test` (includes examples regression).

## Do / Don't

**Commits**

- Do use `feat(extension):` for user-facing extension features
- Do keep commits focused; split unrelated changes
- Do verify tests before commit when code changed
- Don't add `Co-authored-by: Cursor` or bot trailers unless requested
- Don't amend pushed commits unless the user explicitly asks
- Don't force-push `main`

**Miranda**

- Do use juxtaposition for application: `sq x`, not `sq(x)`
- Do use `||` comments; section headers like `--- Tuples` are fine
- Do reuse earlier bindings in tutorial sections instead of redefining names
- Do use `::` for type annotations, `::=` for algebraic types, `==` for synonyms
- Don't use tabs; use spaces with consistent `where` indentation
- Don't shadow standard library or reserved identifiers

**Extension**

- Do register new commands in `package.json` with `Miranda:` titles
- Do add activation events for new views and commands
- Do keep panel views for supporting content (Concept Guide, Lint Issues)
- Don't add excessive view containers or toolbar actions

## Additional resources

- Commit types, scopes, and PR bodies: [conventional-commits.md](conventional-commits.md)
- Language syntax, modules, and example patterns: [miranda-language.md](miranda-language.md)
- Tutorial structure: [docs/walkthrough.md](../../docs/walkthrough.md)
- Turner reference: https://www.cs.kent.ac.uk/people/staff/dat/miranda/Overview.html
