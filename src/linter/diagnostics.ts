import { LintIssue, RuleSeverity } from "./constants";

export enum DiagnosticSeverity {
  Error = 0,
  Warning = 1,
  Information = 2,
  Hint = 3,
}

export interface MappedDiagnostic {
  line: number;
  startColumn: number;
  endColumn: number;
  message: string;
  severity: DiagnosticSeverity;
  ruleId: string;
}

export function ruleSeverityToDiagnostic(severity: RuleSeverity): DiagnosticSeverity | undefined {
  switch (severity) {
    case "error":
      return DiagnosticSeverity.Error;
    case "warn":
      return DiagnosticSeverity.Warning;
    default:
      return undefined;
  }
}

export function issuesToDiagnostics(
  issues: LintIssue[],
  lineCount: number,
  getLineText: (line: number) => string
): MappedDiagnostic[] {
  const diagnostics: MappedDiagnostic[] = [];

  for (const issue of issues) {
    const severity = ruleSeverityToDiagnostic(issue.severity);
    if (severity === undefined) {
      continue;
    }

    const line = Math.max(0, Math.min(issue.line, lineCount - 1));
    const lineText = getLineText(line);
    const startCol = Math.max(0, Math.min(issue.column, lineText.length));
    const endCol = issue.endColumn !== undefined
      ? Math.max(startCol + 1, Math.min(issue.endColumn, lineText.length))
      : startCol + 1;

    diagnostics.push({
      line,
      startColumn: startCol,
      endColumn: endCol,
      message: `[${issue.ruleId}] ${issue.message}`,
      severity,
      ruleId: issue.ruleId,
    });
  }

  return diagnostics;
}
