# Conventional Commits — mirandaSintaxHighligh

Based on [Conventional Commits 1.0.0](https://www.conventionalcommits.org/) and this repository's history.

## Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

- **description**: imperative mood ("add" not "added" or "adds")
- **breaking change**: append `!` after type/scope or add `BREAKING CHANGE:` footer

## Types

| Type | When to use |
|------|-------------|
| `feat` | New feature or user-visible behavior |
| `fix` | Bug fix |
| `docs` | README, walkthrough, comments only |
| `test` | Tests added or updated, no production logic change |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `chore` | Build, tooling, deps, CI, housekeeping |
| `perf` | Performance improvement |
| `style` | Formatting, whitespace (no logic change) |

Prefer `feat` and `fix` for extension work; avoid vague `update` or `changes`.

## Scopes for this project

| Scope | Paths / areas |
|-------|----------------|
| `extension` | `src/extension.ts`, activation, commands, overall UX |
| `linter` | `src/linter/**` |
| `grammar` | `syntaxes/miranda.tmLanguage.json`, grammar tests |
| `views` | `src/views/**`, `package.json` views/menus |
| `examples` | `examples/**` |
| `docs` | `docs/**`, `README.md`, `media/walkthrough/**` |
| `tests` | `src/test/**` only |

Use a single primary scope. If a change spans areas, pick the dominant one or split into multiple commits.

## Subject line rules

1. Lowercase after the colon (except proper nouns: Miranda, VS Code, Turner)
2. No trailing period
3. ≤72 characters
4. Describe the outcome, not the file list

**Good**

```
feat(views): add Concept Guide panel webview
fix(linter): treat guarded equations as single definition
docs: document Miranda commands in README
test(examples): assert all tutorial scripts are lint-clean
```

**Avoid**

```
feat: stuff
updated files
Fix bug
feat(extension): Added the new sidebar and also fixed lint and readme
```

## Body guidelines

Write the body when the subject alone is ambiguous.

- Explain **why** the change matters
- Mention breaking changes or migration steps
- Reference Turner section or lint rule only when it clarifies intent
- Keep to 1–3 sentences

**Example**

```
feat(extension): add Concepts sidebar and Concept Guide panel

Replace the Get Started tree with 12 Turner concepts and a themed panel
webview so learners can read explanations beside runnable examples.
```

## Footer guidelines

Use sparingly in this project.

```
Refs: https://www.cs.kent.ac.uk/people/staff/dat/miranda/Overview.html
```

Do **not** add `Co-authored-by: Cursor` unless the user requests it.

## Commit grouping

| Situation | Approach |
|-----------|----------|
| Feature + tests for same feature | One `feat` commit including tests |
| README for a feature just committed | Separate `docs` commit or same commit if small |
| Lint fix in example + unrelated view work | Two commits |
| `package.json` + new view provider | One `feat(views)` or `feat(extension)` commit |

## Pre-commit checklist

```
- [ ] git diff reviewed; no secrets staged
- [ ] npm run test:all passes (if code/examples/grammar/views changed)
- [ ] examples/**/*.m have no lint errors (if examples touched)
- [ ] package.json is valid JSON (trailing commas break activationEvents)
- [ ] commit message matches <type>(<scope>): <subject>
```

## PR title and body

PR titles follow the same format as commit subjects.

```markdown
## Summary
- Bullet 1: user-facing outcome
- Bullet 2: technical note if needed

## Test plan
- [ ] npm run test:all
- [ ] Extension Development Host: relevant view/command smoke test
```

## Mapping diffs to types

| Diff signal | Type |
|-------------|------|
| New command, view, walkthrough step | `feat(extension)` or `feat(views)` |
| New lint rule or rule fix | `feat(linter)` or `fix(linter)` |
| tmLanguage scope change | `feat(grammar)` or `fix(grammar)` |
| Example script added/fixed | `feat(examples)` or `fix(examples)` |
| Test file only | `test` |
| README / walkthrough prose | `docs` |
