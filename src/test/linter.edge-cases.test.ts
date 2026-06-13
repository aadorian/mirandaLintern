import { expect } from "chai";
import { lintMiranda } from "../linter/linter";
import {
  assertHasRule,
  assertNoRule,
  createConfig,
  createConfigWithOnlyRule,
  findRule,
  lint,
} from "./helpers";

describe("lintMiranda edge cases", () => {
  it("returns no issues for an empty file", () => {
    expect(lint("")).to.be.empty;
  });

  it("returns no issues for blank lines only", () => {
    expect(lint("\n\n\n")).to.be.empty;
  });

  it("handles CRLF line endings", () => {
    const issues = lint("x = 1\r\n", createConfigWithOnlyRule("requireFinalNewline"));
    assertNoRule(issues, "require-final-newline");
  });

  it("does not flag booleans inside string literals", () => {
    const issues = lint('msg = "true and false"\n', createConfigWithOnlyRule("booleanLiteralCase"));
    assertNoRule(issues, "boolean-literal-case");
  });

  it("does not flag identifiers mentioned only in comments", () => {
    const issues = lint("|| mystery_var is documented here\nx = 1\n", createConfigWithOnlyRule("noUndefinedIdentifier"));
    assertNoRule(issues, "no-undefined-identifier");
  });

  it("does not treat type signatures as duplicate equations", () => {
    const source = "fib :: num -> num\nfib n = n\n";
    const issues = lint(source, createConfigWithOnlyRule("noDuplicateDefinitions"));
    assertNoRule(issues, "no-duplicate-definitions");
  });

  it("does not treat ~= as an equation assignment", () => {
    const source = "eq a b = a ~= b\n";
    const issues = lint(source, createConfigWithOnlyRule("noDuplicateDefinitions"));
    assertNoRule(issues, "no-duplicate-definitions");
  });

  it("does not treat == as an equation assignment", () => {
    const source = "alias == num\n";
    const issues = lint(source, createConfigWithOnlyRule("noUnusedDefinitions"));
    assertNoRule(issues, "no-unused-definitions");
  });

  it("skips unused check for underscore-prefixed definitions", () => {
    const issues = lint("_private = 1\n", createConfigWithOnlyRule("noUnusedDefinitions"));
    assertNoRule(issues, "no-unused-definitions");
  });

  it("recognizes abstype names as defined bindings", () => {
    const source = [
      "abstype set *",
      "with empty :: set *",
      "empty = []",
      "",
    ].join("\n");
    const issues = lint(source, createConfigWithOnlyRule("noUndefinedIdentifier"));
    assertNoRule(issues, "no-undefined-identifier");
  });

  it("recognizes where-local bindings", () => {
    const source = [
      "f x = local_value",
      "  where",
      "   local_value = x + 1",
      "",
    ].join("\n");
    const issues = lint(source, createConfigWithOnlyRule("noUndefinedIdentifier"));
    const localIssues = findRule(issues, "no-undefined-identifier").filter((i) =>
      i.message.includes("local_value")
    );
    expect(localIssues).to.be.empty;
  });

  it("allows reserved words in expression position", () => {
    const source = "fib n = 1, if n <= 2\n";
    const issues = lint(source, createConfigWithOnlyRule("noUndefinedIdentifier"));
    assertNoRule(issues, "no-undefined-identifier");
  });

  it("reports multiple distinct violations", () => {
    const source = "bad = true  \n# wrong comment\n";
    const issues = lint(source, createConfig({
      rules: {
        booleanLiteralCase: "error",
        noTrailingSpaces: "error",
        commentStyle: "error",
      },
    }));
    expect(findRule(issues, "boolean-literal-case")).to.not.be.empty;
    expect(findRule(issues, "no-trailing-spaces")).to.not.be.empty;
    expect(findRule(issues, "comment-style")).to.not.be.empty;
  });

  it("preserves warn severity on issues", () => {
    const issues = lint("x = 1  \n", createConfigWithOnlyRule("noTrailingSpaces", "warn"));
    expect(issues[0].severity).to.equal("warn");
  });

  it("preserves error severity on issues", () => {
    const issues = lint("if = 1\n", createConfigWithOnlyRule("reservedWordAsIdentifier", "error"));
    expect(issues[0].severity).to.equal("error");
  });

  it("respects a custom maxLineLength threshold", () => {
    const source = "x = " + "a".repeat(30) + "\n";
    const issues = lintMiranda(source, createConfig({
      maxLineLength: 20,
      rules: { maxLineLength: "error" },
    }));
    assertHasRule(issues, "max-line-length");
    expect(issues[0].message).to.include("20");
  });

  it("detects tabs anywhere on the line including inside string literals", () => {
    const issues = lint('msg = "a\tb"\n', createConfigWithOnlyRule("noTabs"));
    assertHasRule(issues, "no-tabs");
  });

  it("detects several reserved words used as definitions", () => {
    for (const word of ["where", "type", "mod"]) {
      const issues = lint(`${word} = 1\n`, createConfigWithOnlyRule("reservedWordAsIdentifier"));
      assertHasRule(issues, "reserved-word-as-identifier");
      expect(issues[0].message).to.include(`'${word}'`);
    }
  });

  it("treats type signature names as used when referenced in equations", () => {
    const source = "qsort :: [*] -> [*]\nqsort [] = []\n";
    const issues = lint(source, createConfigWithOnlyRule("noUnusedDefinitions"));
    assertNoRule(issues, "no-unused-definitions");
  });
});
