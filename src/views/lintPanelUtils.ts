export const MIRANDA_DIAGNOSTIC_SOURCE = "miranda";

export const DiagnosticSeverity = {
  Error: 0,
  Warning: 1,
  Information: 2,
  Hint: 3,
} as const;

export type DiagnosticSeverityValue =
  (typeof DiagnosticSeverity)[keyof typeof DiagnosticSeverity];

export interface DiagnosticLike {
  source?: string;
  code?: string | number | { value: string | number };
  message: string;
  severity: DiagnosticSeverityValue;
  range: { start: { line: number; character: number } };
}

function resolveRuleId(code: DiagnosticLike["code"]): string {
  if (code === undefined) {
    return "miranda";
  }
  if (typeof code === "object") {
    return String(code.value);
  }
  return String(code);
}

export interface LintIssueNode {
  id: string;
  label: string;
  line: number;
  column: number;
  severity: DiagnosticSeverityValue;
  ruleId: string;
  message: string;
}

export function formatLintIssueLabel(
  line: number,
  ruleId: string,
  message: string
): string {
  const lineNum = line + 1;
  const shortMessage = message.length > 60 ? `${message.slice(0, 57)}...` : message;
  return `L${lineNum} ${ruleId}: ${shortMessage}`;
}

export function diagnosticsToIssueNodes(
  diagnostics: readonly DiagnosticLike[]
): LintIssueNode[] {
  return diagnostics
    .filter((d) => d.source === MIRANDA_DIAGNOSTIC_SOURCE)
    .map((diagnostic, index) => ({
      id: `issue-${index}`,
      label: formatLintIssueLabel(
        diagnostic.range.start.line,
        resolveRuleId(diagnostic.code),
        diagnostic.message
      ),
      line: diagnostic.range.start.line,
      column: diagnostic.range.start.character,
      severity: diagnostic.severity,
      ruleId: resolveRuleId(diagnostic.code),
      message: diagnostic.message,
    }));
}

export function countDiagnosticsBySeverity(
  diagnostics: readonly DiagnosticLike[]
): { errors: number; warnings: number } {
  const miranda = diagnostics.filter((d) => d.source === MIRANDA_DIAGNOSTIC_SOURCE);
  return {
    errors: miranda.filter((d) => d.severity === DiagnosticSeverity.Error).length,
    warnings: miranda.filter((d) => d.severity === DiagnosticSeverity.Warning).length,
  };
}
