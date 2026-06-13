import {
  ALLOWED_SINGLE_CHAR,
  LintConfig,
  LintIssue,
  RESERVED_WORDS,
  RuleSeverity,
  STANDARD_LIBRARY,
} from "./constants";

interface Definition {
  name: string;
  line: number;
  column: number;
  isEquation?: boolean;
}

interface ParsedDocument {
  definitions: Definition[];
  bindings: Set<string>;
  references: Map<string, { line: number; column: number }[]>;
  whereBlocks: { line: number; indent: number }[];
}

function stripCommentsAndStrings(line: string): string {
  let result = "";
  let i = 0;
  let inString = false;
  let inChar = false;
  let stringChar = "";

  while (i < line.length) {
    const ch = line[i];
    const next = line[i + 1];

    if (!inString && !inChar && ch === "|" && next === "|") {
      break;
    }

    if (!inChar && ch === '"') {
      if (inString && stringChar === '"') {
        inString = false;
        result += "  ";
        i++;
        continue;
      }
      if (!inString) {
        inString = true;
        stringChar = '"';
        result += "  ";
        i++;
        continue;
      }
    }

    if (!inString && ch === "'") {
      if (inChar) {
        inChar = false;
        result += " ";
        i++;
        continue;
      }
      inChar = true;
      result += " ";
      i++;
      continue;
    }

    if (inString || inChar) {
      result += " ";
    } else {
      result += ch;
    }
    i++;
  }

  return result;
}

function getIndent(line: string): number {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
}

function extractPatternBindings(lhs: string, bindings: Set<string>): void {
  const patternId = /\b([a-z_][A-Za-z0-9_']*)\b/g;
  let match: RegExpExecArray | null;
  while ((match = patternId.exec(lhs)) !== null) {
    bindings.add(match[1]);
  }
}

function parseDocument(lines: string[]): ParsedDocument {
  const definitions: Definition[] = [];
  const bindings = new Set<string>();
  const references = new Map<string, { line: number; column: number }[]>();
  const whereBlocks: { line: number; indent: number }[] = [];
  const defPattern = /^(\s*)([a-z_][A-Za-z0-9_']*)\s+/;
  const typeSigPattern = /^(\s*)([a-z_][A-Za-z0-9_']*)\s*::/;
  const abstypePattern = /^(\s*)abstype\s+([A-Za-z][A-Za-z0-9_']*)/;
  const idPattern = /\b([a-z_][A-Za-z0-9_']*)\b/g;

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const raw = lines[lineNum];
    const cleaned = stripCommentsAndStrings(raw);

    if (/^\s*where\b/.test(cleaned)) {
      whereBlocks.push({ line: lineNum, indent: getIndent(raw) });
    }

    const typeMatch = cleaned.match(typeSigPattern);
    if (typeMatch) {
      definitions.push({
        name: typeMatch[2],
        line: lineNum,
        column: typeMatch[1].length,
      });
      bindings.add(typeMatch[2]);
    }

    const abstypeMatch = cleaned.match(abstypePattern);
    if (abstypeMatch) {
      definitions.push({
        name: abstypeMatch[2],
        line: lineNum,
        column: abstypeMatch[1].length,
      });
      bindings.add(abstypeMatch[2]);
    }

    const eqPos = cleaned.indexOf("=");
    if (eqPos > 0 && !cleaned.includes("::") && !cleaned.includes("==") && !cleaned.includes("::=") && !cleaned.includes("~=")) {
      const lhs = cleaned.substring(0, eqPos).trim();
      const topLevelMatch = lhs.match(/^([a-z_][A-Za-z0-9_']*)/);
      if (topLevelMatch) {
        extractPatternBindings(lhs, bindings);
        definitions.push({
          name: topLevelMatch[1],
          line: lineNum,
          column: cleaned.match(defPattern)?.[1].length ?? 0,
          isEquation: true,
        });
      }
    }

    // Comprehension generators: b<-x
    const genPattern = /\b([a-z_][A-Za-z0-9_']*)\s*<-/g;
    let genMatch: RegExpExecArray | null;
    while ((genMatch = genPattern.exec(cleaned)) !== null) {
      bindings.add(genMatch[1]);
    }

    let match: RegExpExecArray | null;
    idPattern.lastIndex = 0;
    while ((match = idPattern.exec(cleaned)) !== null) {
      const name = match[1];
      const refs = references.get(name) ?? [];
      refs.push({ line: lineNum, column: match.index });
      references.set(name, refs);
    }
  }

  return { definitions, bindings, references, whereBlocks };
}

function pushIssue(
  issues: LintIssue[],
  severity: RuleSeverity,
  ruleId: string,
  line: number,
  column: number,
  message: string,
  endColumn?: number
): void {
  if (severity === "off") {
    return;
  }
  issues.push({ line, column, endColumn, message, ruleId, severity });
}

export function lintMiranda(source: string, config: LintConfig): LintIssue[] {
  if (!config.enable) {
    return [];
  }

  const issues: LintIssue[] = [];
  const lines = source.split(/\r?\n/);
  const parsed = parseDocument(lines);
  const definedNames = new Set([...parsed.definitions.map((d) => d.name), ...parsed.bindings]);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i;
    const cleaned = stripCommentsAndStrings(line);

    // no-trailing-spaces
    const trailing = line.match(/\s+$/);
    if (trailing) {
      pushIssue(
        issues,
        config.rules.noTrailingSpaces,
        "no-trailing-spaces",
        lineNum,
        line.length - trailing[0].length,
        "Trailing spaces not allowed",
        line.length
      );
    }

    // no-tabs
    const tabIdx = line.indexOf("\t");
    if (tabIdx >= 0) {
      pushIssue(
        issues,
        config.rules.noTabs,
        "no-tabs",
        lineNum,
        tabIdx,
        "Tab characters are not allowed; use spaces",
        tabIdx + 1
      );
    }

    // max-line-length
    if (line.length > config.maxLineLength) {
      pushIssue(
        issues,
        config.rules.maxLineLength,
        "max-line-length",
        lineNum,
        config.maxLineLength,
        `Line exceeds maximum length of ${config.maxLineLength} characters`,
        line.length
      );
    }

    // comment-style: detect # or // style comments
    if (/^\s*#/.test(line) || /^\s*\/\//.test(line)) {
      pushIssue(
        issues,
        config.rules.commentStyle,
        "comment-style",
        lineNum,
        0,
        "Miranda comments must use || (double pipe)"
      );
    }

    // boolean-literal-case
    const falseMatch = cleaned.match(/\b(true|false)\b/);
    if (falseMatch) {
      pushIssue(
        issues,
        config.rules.booleanLiteralCase,
        "boolean-literal-case",
        lineNum,
        falseMatch.index ?? 0,
        `Use '${falseMatch[1] === "true" ? "True" : "False"}' instead of '${falseMatch[1]}'`,
        (falseMatch.index ?? 0) + falseMatch[1].length
      );
    }

    // unmatched-quotes
    {
      let inStr = false;
      let inChr = false;
      for (let j = 0; j < line.length; j++) {
        if (!inChr && line[j] === '"' && (j === 0 || line[j - 1] !== "\\")) {
          inStr = !inStr;
        }
        if (!inStr && line[j] === "'" && (j === 0 || line[j - 1] !== "\\")) {
          inChr = !inChr;
        }
      }
      if (inStr) {
        pushIssue(
          issues,
          config.rules.unmatchedQuotes,
          "unmatched-quotes",
          lineNum,
          0,
          "Unmatched double quote in string literal"
        );
      }
      if (inChr) {
        pushIssue(
          issues,
          config.rules.unmatchedQuotes,
          "unmatched-quotes",
          lineNum,
          0,
          "Unmatched single quote in character literal"
        );
      }
    }

    // reserved-word-as-identifier (in definition position)
    const defOnLine = cleaned.match(/^(\s*)([a-z_][A-Za-z0-9_']*)\s*=/);
    if (defOnLine && RESERVED_WORDS.has(defOnLine[2])) {
      pushIssue(
        issues,
        config.rules.reservedWordAsIdentifier,
        "reserved-word-as-identifier",
        lineNum,
        defOnLine[1].length,
        `'${defOnLine[2]}' is a reserved word and cannot be used as an identifier`,
        defOnLine[1].length + defOnLine[2].length
      );
    }

    // no-single-char-names
    if (defOnLine && defOnLine[2].length === 1 && !ALLOWED_SINGLE_CHAR.has(defOnLine[2])) {
      pushIssue(
        issues,
        config.rules.noSingleCharNames,
        "no-single-char-names",
        lineNum,
        defOnLine[1].length,
        `Single-character identifier '${defOnLine[2]}' is discouraged`,
        defOnLine[1].length + 1
      );
    }

    // no-undefined-identifier
    const idPattern = /\b([a-z_][A-Za-z0-9_']*)\b/g;
    let idMatch: RegExpExecArray | null;
    while ((idMatch = idPattern.exec(cleaned)) !== null) {
      const name = idMatch[1];
      if (
        RESERVED_WORDS.has(name) ||
        definedNames.has(name) ||
        STANDARD_LIBRARY.has(name) ||
        ALLOWED_SINGLE_CHAR.has(name)
      ) {
        continue;
      }
      pushIssue(
        issues,
        config.rules.noUndefinedIdentifier,
        "no-undefined-identifier",
        lineNum,
        idMatch.index,
        `Identifier '${name}' is not defined in scope or standard library`,
        idMatch.index + name.length
      );
    }
  }

  // no-duplicate-definitions (top-level equations with the same name and pattern)
  const equationDefs = parsed.definitions.filter((d) => d.isEquation);
  const equationSeen = new Map<string, number>();
  for (const def of equationDefs) {
    const line = stripCommentsAndStrings(lines[def.line]);
    const lhs = line.substring(0, line.indexOf("=")).trim();
    const key = `${def.name}::${lhs}`;
    const prev = equationSeen.get(key);
    if (prev !== undefined) {
      pushIssue(
        issues,
        config.rules.noDuplicateDefinitions,
        "no-duplicate-definitions",
        def.line,
        def.column,
        `Duplicate equation for '${def.name}' (first defined on line ${prev + 1})`,
        def.column + def.name.length
      );
    } else {
      equationSeen.set(key, def.line);
    }
  }

  // no-unused-definitions
  for (const def of parsed.definitions) {
    const refs = parsed.references.get(def.name) ?? [];
    const usedElsewhere = refs.some(
      (r) => !(r.line === def.line && r.column === def.column)
    );
    if (!usedElsewhere && !def.name.startsWith("_")) {
      pushIssue(
        issues,
        config.rules.noUnusedDefinitions,
        "no-unused-definitions",
        def.line,
        def.column,
        `Definition '${def.name}' is never used`,
        def.column + def.name.length
      );
    }
  }

  // consistent-indent (offside rule for where blocks)
  for (const where of parsed.whereBlocks) {
    const whereIndent = where.indent;
    for (let j = where.line + 1; j < lines.length; j++) {
      const nextLine = lines[j];
      if (/^\s*$/.test(nextLine) || /^\s*\|\|/.test(nextLine)) {
        continue;
      }
      const nextIndent = getIndent(nextLine);
      const nextCleaned = stripCommentsAndStrings(nextLine);

      if (/^\s*(otherwise|where)\b/.test(nextCleaned) && nextIndent <= whereIndent) {
        break;
      }

      if (nextIndent <= whereIndent && !/^\s*(otherwise)\b/.test(nextCleaned)) {
        break;
      }

      const expected = whereIndent + config.indentSize;
      if (nextIndent < expected && nextIndent > whereIndent) {
        pushIssue(
          issues,
          config.rules.consistentIndent,
          "consistent-indent",
          j,
          0,
          `Inconsistent indentation after 'where' (expected at least ${expected} spaces, got ${nextIndent})`,
          nextIndent
        );
      }
    }
  }

  // require-final-newline
  if (source.length > 0 && !source.endsWith("\n")) {
    pushIssue(
      issues,
      config.rules.requireFinalNewline,
      "require-final-newline",
      lines.length - 1,
      lines[lines.length - 1].length,
      "File must end with a newline"
    );
  }

  return issues;
}
