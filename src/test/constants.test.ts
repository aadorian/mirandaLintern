import { expect } from "chai";
import {
  ALLOWED_SINGLE_CHAR,
  DEFAULT_LINT_CONFIG,
  RESERVED_WORDS,
  STANDARD_LIBRARY,
} from "../linter/constants";

describe("constants", () => {
  describe("STANDARD_LIBRARY", () => {
    it("includes core list functions", () => {
      for (const name of ["hd", "tl", "map", "filter", "foldr", "concat"]) {
        expect(STANDARD_LIBRARY.has(name), `missing ${name}`).to.be.true;
      }
    });

    it("includes boolean literals", () => {
      expect(STANDARD_LIBRARY.has("True")).to.be.true;
      expect(STANDARD_LIBRARY.has("False")).to.be.true;
    });

    it("includes math and string helpers", () => {
      for (const name of ["sqrt", "abs", "show", "lines", "digit"]) {
        expect(STANDARD_LIBRARY.has(name), `missing ${name}`).to.be.true;
      }
    });
  });

  describe("RESERVED_WORDS", () => {
    it("includes control flow keywords", () => {
      for (const word of ["if", "otherwise", "where"]) {
        expect(RESERVED_WORDS.has(word), `missing ${word}`).to.be.true;
      }
    });

    it("includes type declaration keywords", () => {
      for (const word of ["abstype", "with", "type"]) {
        expect(RESERVED_WORDS.has(word), `missing ${word}`).to.be.true;
      }
    });

    it("includes directive names", () => {
      for (const word of ["include", "export", "bnf"]) {
        expect(RESERVED_WORDS.has(word), `missing ${word}`).to.be.true;
      }
    });
  });

  describe("ALLOWED_SINGLE_CHAR", () => {
    it("allows common pattern variables", () => {
      for (const name of ["x", "n", "a", "b", "f"]) {
        expect(ALLOWED_SINGLE_CHAR.has(name), `missing ${name}`).to.be.true;
      }
    });

    it("does not allow arbitrary single letters", () => {
      expect(ALLOWED_SINGLE_CHAR.has("q")).to.be.false;
      expect(ALLOWED_SINGLE_CHAR.has("z")).to.be.true;
    });
  });

  describe("DEFAULT_LINT_CONFIG", () => {
    const expectedRules = [
      "noTrailingSpaces",
      "requireFinalNewline",
      "noTabs",
      "consistentIndent",
      "noDuplicateDefinitions",
      "noUndefinedIdentifier",
      "noUnusedDefinitions",
      "booleanLiteralCase",
      "commentStyle",
      "noSingleCharNames",
      "maxLineLength",
      "unmatchedQuotes",
      "reservedWordAsIdentifier",
    ];

    it("defines all 13 lint rules", () => {
      expect(Object.keys(DEFAULT_LINT_CONFIG.rules)).to.have.members(expectedRules);
    });

    it("uses expected default severities", () => {
      expect(DEFAULT_LINT_CONFIG.rules.booleanLiteralCase).to.equal("error");
      expect(DEFAULT_LINT_CONFIG.rules.noSingleCharNames).to.equal("off");
      expect(DEFAULT_LINT_CONFIG.rules.noTrailingSpaces).to.equal("warn");
    });

    it("uses expected top-level defaults", () => {
      expect(DEFAULT_LINT_CONFIG.enable).to.be.true;
      expect(DEFAULT_LINT_CONFIG.maxLineLength).to.equal(80);
      expect(DEFAULT_LINT_CONFIG.indentSize).to.equal(1);
    });
  });
});
