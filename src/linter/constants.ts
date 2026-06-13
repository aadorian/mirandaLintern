/**
 * Miranda standard environment identifiers.
 * Source: miranda-documentation/standard_environment + ncihnegn/miranda prelude
 */
export const STANDARD_LIBRARY = new Set([
  // Values
  "pi", "e", "tinynum", "hugenum", "undef",
  // Basic functions
  "hd", "tl", "last", "init", "member", "neg", "subtract",
  "or", "and", "max", "min", "max2", "min2", "fst", "snd", "postfix",
  "reverse", "merge", "sort", "take", "drop", "rep", "repeat", "mkset",
  "limit", "index", "concat", "zip2", "zip3", "zip4", "zip5", "zip6",
  "transpose",
  // Higher order
  "map", "map2", "filter", "takewhile", "dropwhile",
  "foldr", "foldl", "foldl1", "foldr1", "scan", "iterate", "until",
  // Math
  "numval", "entier", "integer", "abs", "sqrt", "exp", "log", "log10",
  "sum", "product", "sin", "cos", "arctan",
  // String/char
  "letter", "digit", "code", "decode", "show", "shownum", "showfloat",
  "showscaled", "spaces", "ljustify", "rjustify", "cjustify", "lay",
  "layn", "lines",
  // System
  "read", "filemode", "system", "getenv",
  // Combinators
  "id", "const", "converse",
  // Misc
  "error", "force", "seq",
  // Prelude helpers (commonly visible)
  "remove", "listdiff", "showbool", "showchar", "showlist", "showstring",
  "shownum1", "showparen", "showpair", "showvoid", "showfunction",
  "showabstract", "showwhat", "diagonalise", "base", "mkdigit", "charname",
  "showstr", "rep", "pad", "digit",
  // Booleans as values
  "True", "False",
]);

export const RESERVED_WORDS = new Set([
  "if", "otherwise", "where", "abstype", "with", "type",
  "div", "mod", "show", "readvals",
  "True", "False",
  // Directives
  "begin", "bnf", "export", "free", "include", "insert", "lex", "list", "nolist",
  // BNF nonterminals
  "empty", "end", "error",
]);

export const ALLOWED_SINGLE_CHAR = new Set([
  "x", "y", "z", "n", "m", "f", "g", "h", "a", "b", "c", "d", "p", "r", "s", "t", "k", "i", "j", "u", "v", "w",
]);

export type RuleSeverity = "off" | "warn" | "error";

export interface LintConfig {
  enable: boolean;
  maxLineLength: number;
  indentSize: number;
  rules: Record<string, RuleSeverity>;
}

export interface LintIssue {
  line: number;
  column: number;
  endColumn?: number;
  message: string;
  ruleId: string;
  severity: RuleSeverity;
}

export const DEFAULT_LINT_CONFIG: LintConfig = {
  enable: true,
  maxLineLength: 80,
  indentSize: 1,
  rules: {
    noTrailingSpaces: "warn",
    requireFinalNewline: "warn",
    noTabs: "warn",
    consistentIndent: "error",
    noDuplicateDefinitions: "error",
    noUndefinedIdentifier: "warn",
    noUnusedDefinitions: "warn",
    booleanLiteralCase: "error",
    commentStyle: "warn",
    noSingleCharNames: "off",
    maxLineLength: "warn",
    unmatchedQuotes: "error",
    reservedWordAsIdentifier: "error",
  },
};
