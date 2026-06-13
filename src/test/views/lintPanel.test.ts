import { expect } from "chai";
import {
  countDiagnosticsBySeverity,
  DiagnosticSeverity,
  diagnosticsToIssueNodes,
  formatLintIssueLabel,
  MIRANDA_DIAGNOSTIC_SOURCE,
} from "../../views/lintPanelUtils";

describe("lintPanel helpers", () => {
  it("formats issue labels with line number and rule id", () => {
    const label = formatLintIssueLabel(11, "no-tabs", "Tab character found");
    expect(label).to.equal("L12 no-tabs: Tab character found");
  });

  it("truncates long messages in labels", () => {
    const longMessage = "x".repeat(80);
    const label = formatLintIssueLabel(0, "rule", longMessage);
    expect(label.endsWith("...")).to.be.true;
    expect(label.length).to.be.lessThan(longMessage.length + 10);
  });

  it("maps miranda diagnostics to issue nodes", () => {
    const diagnostics = [
      {
        source: MIRANDA_DIAGNOSTIC_SOURCE,
        code: "boolean-literal-case",
        message: "use True",
        severity: DiagnosticSeverity.Error,
        range: { start: { line: 0, character: 2 } },
      },
      {
        source: "eslint",
        code: "no-tabs",
        message: "tab",
        severity: DiagnosticSeverity.Warning,
        range: { start: { line: 1, character: 0 } },
      },
    ];
    const nodes = diagnosticsToIssueNodes(diagnostics);
    expect(nodes).to.have.lengthOf(1);
    expect(nodes[0].ruleId).to.equal("boolean-literal-case");
    expect(nodes[0].line).to.equal(0);
    expect(nodes[0].column).to.equal(2);
  });

  it("counts errors and warnings for miranda diagnostics only", () => {
    const diagnostics = [
      {
        source: MIRANDA_DIAGNOSTIC_SOURCE,
        message: "err1",
        severity: DiagnosticSeverity.Error,
        range: { start: { line: 0, character: 0 } },
      },
      {
        source: MIRANDA_DIAGNOSTIC_SOURCE,
        message: "warn1",
        severity: DiagnosticSeverity.Warning,
        range: { start: { line: 1, character: 0 } },
      },
      {
        source: "other",
        message: "warn2",
        severity: DiagnosticSeverity.Warning,
        range: { start: { line: 2, character: 0 } },
      },
    ];
    const counts = countDiagnosticsBySeverity(diagnostics);
    expect(counts.errors).to.equal(1);
    expect(counts.warnings).to.equal(1);
  });
});
