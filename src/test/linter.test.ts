import { expect } from "chai";
import * as fs from "fs";
import * as path from "path";
import { lintMiranda } from "../linter/linter";
import {
  assertHasRule,
  assertNoRule,
  createConfig,
  createConfigWithOnlyRule,
  findRule,
  lint,
} from "./helpers";

describe("lintMiranda", () => {
  describe("config", () => {
    it("returns empty array when linting is disabled", () => {
      const issues = lint("x = 1  \n", { enable: false });
      expect(issues).to.be.empty;
    });

    it("skips rules with severity off", () => {
      const issues = lint("x = 1  \n", {
        rules: { noTrailingSpaces: "off" },
      });
      assertNoRule(issues, "no-trailing-spaces");
    });
  });

  describe("no-trailing-spaces", () => {
    it("detects trailing whitespace", () => {
      const issues = lint("x = 1  \n", createConfigWithOnlyRule("noTrailingSpaces"));
      assertHasRule(issues, "no-trailing-spaces");
    });

    it("passes clean lines", () => {
      const issues = lint("x = 1\n", createConfigWithOnlyRule("noTrailingSpaces"));
      assertNoRule(issues, "no-trailing-spaces");
    });
  });

  describe("no-tabs", () => {
    it("detects tab characters", () => {
      const issues = lint("x\t= 1\n", createConfigWithOnlyRule("noTabs"));
      assertHasRule(issues, "no-tabs");
    });

    it("passes space indentation", () => {
      const issues = lint("x = 1\n", createConfigWithOnlyRule("noTabs"));
      assertNoRule(issues, "no-tabs");
    });
  });

  describe("max-line-length", () => {
    it("detects lines exceeding the limit", () => {
      const longLine = "x = " + "a".repeat(80) + "\n";
      const issues = lint(longLine, createConfigWithOnlyRule("maxLineLength", "error"));
      assertHasRule(issues, "max-line-length");
    });

    it("passes short lines", () => {
      const issues = lint("x = 1\n", createConfigWithOnlyRule("maxLineLength"));
      assertNoRule(issues, "max-line-length");
    });
  });

  describe("comment-style", () => {
    it("detects hash-style comments", () => {
      const issues = lint("# not a Miranda comment\n", createConfigWithOnlyRule("commentStyle"));
      assertHasRule(issues, "comment-style");
    });

    it("detects slash-style comments", () => {
      const issues = lint("// not a Miranda comment\n", createConfigWithOnlyRule("commentStyle"));
      assertHasRule(issues, "comment-style");
    });

    it("passes double-pipe comments", () => {
      const issues = lint("|| valid Miranda comment\n", createConfigWithOnlyRule("commentStyle"));
      assertNoRule(issues, "comment-style");
    });
  });

  describe("boolean-literal-case", () => {
    it("detects lowercase true", () => {
      const issues = lint("flag = true\n", createConfigWithOnlyRule("booleanLiteralCase"));
      assertHasRule(issues, "boolean-literal-case");
    });

    it("detects lowercase false", () => {
      const issues = lint("flag = false\n", createConfigWithOnlyRule("booleanLiteralCase"));
      assertHasRule(issues, "boolean-literal-case");
    });

    it("passes capitalized booleans", () => {
      const issues = lint("flag = True\nother = False\n", createConfigWithOnlyRule("booleanLiteralCase"));
      assertNoRule(issues, "boolean-literal-case");
    });
  });

  describe("unmatched-quotes", () => {
    it("detects unmatched double quotes", () => {
      const issues = lint('msg = "hello\n', createConfigWithOnlyRule("unmatchedQuotes"));
      assertHasRule(issues, "unmatched-quotes");
    });

    it("detects unmatched single quotes", () => {
      const issues = lint("ch = 'a\n", createConfigWithOnlyRule("unmatchedQuotes"));
      assertHasRule(issues, "unmatched-quotes");
    });

    it("passes matched quotes", () => {
      const issues = lint('msg = "hello"\nch = \'a\'\n', createConfigWithOnlyRule("unmatchedQuotes"));
      assertNoRule(issues, "unmatched-quotes");
    });
  });

  describe("reserved-word-as-identifier", () => {
    it("detects reserved words used as definitions", () => {
      const issues = lint("if = 1\n", createConfigWithOnlyRule("reservedWordAsIdentifier"));
      assertHasRule(issues, "reserved-word-as-identifier");
    });

    it("passes valid function definitions", () => {
      const issues = lint("fib n = 1\n", createConfigWithOnlyRule("reservedWordAsIdentifier"));
      assertNoRule(issues, "reserved-word-as-identifier");
    });
  });

  describe("no-single-char-names", () => {
    it("detects discouraged single-character names", () => {
      const issues = lint("q = 1\n", createConfigWithOnlyRule("noSingleCharNames"));
      assertHasRule(issues, "no-single-char-names");
    });

    it("allows common single-character names", () => {
      const issues = lint("x = 1\n", createConfigWithOnlyRule("noSingleCharNames"));
      assertNoRule(issues, "no-single-char-names");
    });
  });

  describe("no-undefined-identifier", () => {
    it("detects unknown identifiers", () => {
      const issues = lint("fn x = mystery_var\n", createConfigWithOnlyRule("noUndefinedIdentifier"));
      assertHasRule(issues, "no-undefined-identifier");
      expect(findRule(issues, "no-undefined-identifier")[0].message).to.include("mystery_var");
    });

    it("passes standard library identifiers", () => {
      const issues = lint("y = map id x\n", createConfigWithOnlyRule("noUndefinedIdentifier"));
      assertNoRule(issues, "no-undefined-identifier");
    });

    it("passes pattern-bound variables", () => {
      const issues = lint("fib n = n + 1\n", createConfigWithOnlyRule("noUndefinedIdentifier"));
      assertNoRule(issues, "no-undefined-identifier");
    });

    it("passes comprehension generator variables", () => {
      const issues = lint("xs = [b | b<-items]\n", createConfigWithOnlyRule("noUndefinedIdentifier"));
      const undefinedIssues = findRule(issues, "no-undefined-identifier");
      const bIssues = undefinedIssues.filter((i) => i.message.includes("'b'"));
      expect(bIssues).to.be.empty;
    });
  });

  describe("no-duplicate-definitions", () => {
    it("detects duplicate equations", () => {
      const source = "duplicate = 1\nduplicate = 2\n";
      const issues = lint(source, createConfigWithOnlyRule("noDuplicateDefinitions"));
      assertHasRule(issues, "no-duplicate-definitions");
    });

    it("allows distinct equations for the same function", () => {
      const source = "fib n = 1, if n<=2\n      = fib(n-1) + fib(n-2), otherwise\n";
      const issues = lint(source, createConfigWithOnlyRule("noDuplicateDefinitions"));
      assertNoRule(issues, "no-duplicate-definitions");
    });
  });

  describe("no-unused-definitions", () => {
    it("detects unused top-level definitions", () => {
      const issues = lint("unused = 1\n", createConfigWithOnlyRule("noUnusedDefinitions"));
      assertHasRule(issues, "no-unused-definitions");
    });

    it("passes recursively used definitions", () => {
      const source = "fib n = fib (n-1)\n";
      const issues = lint(source, createConfigWithOnlyRule("noUnusedDefinitions"));
      assertNoRule(issues, "no-unused-definitions");
    });
  });

  describe("consistent-indent", () => {
    it("detects inconsistent indentation after where", () => {
      const source = [
        "f x = g x",
        "  where",
        "   a = 1",
        "",
      ].join("\n");
      const issues = lint(source, createConfig({
        indentSize: 3,
        rules: { consistentIndent: "error" },
      }));
      assertHasRule(issues, "consistent-indent");
    });

    it("passes correctly indented where blocks", () => {
      const source = [
        "f x = g x",
        "  where",
        "   a = 1",
        "   b = 2",
        "",
      ].join("\n");
      const issues = lint(source, createConfigWithOnlyRule("consistentIndent"));
      assertNoRule(issues, "consistent-indent");
    });
  });

  describe("require-final-newline", () => {
    it("detects missing final newline", () => {
      const issues = lintMiranda("x = 1", createConfig({
        rules: { requireFinalNewline: "error" },
      }));
      assertHasRule(issues, "require-final-newline");
    });

    it("passes when file ends with newline", () => {
      const issues = lint("x = 1\n", createConfigWithOnlyRule("requireFinalNewline"));
      assertNoRule(issues, "require-final-newline");
    });
  });

  describe("example fixtures", () => {
    const examplesDir = path.join(process.cwd(), "examples");

    it("fib.m has no lint issues", () => {
      const source = fs.readFileSync(path.join(examplesDir, "fib.m"), "utf8");
      const issues = lint(source);
      expect(issues).to.be.empty;
    });

    it("quicksort.m only warns about unused testdata", () => {
      const source = fs.readFileSync(path.join(examplesDir, "quicksort.m"), "utf8");
      const issues = lint(source);
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].ruleId).to.equal("no-unused-definitions");
      expect(issues[0].message).to.include("testdata");
    });
  });
});
