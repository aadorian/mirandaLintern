import { expect } from "chai";
import {
  DiagnosticSeverity,
  issuesToDiagnostics,
  ruleSeverityToDiagnostic,
} from "../linter/diagnostics";
import { LintIssue } from "../linter/constants";

describe("diagnostics", () => {
  describe("ruleSeverityToDiagnostic", () => {
    it("maps error to DiagnosticSeverity.Error", () => {
      expect(ruleSeverityToDiagnostic("error")).to.equal(DiagnosticSeverity.Error);
    });

    it("maps warn to DiagnosticSeverity.Warning", () => {
      expect(ruleSeverityToDiagnostic("warn")).to.equal(DiagnosticSeverity.Warning);
    });

    it("returns undefined for off", () => {
      expect(ruleSeverityToDiagnostic("off")).to.be.undefined;
    });
  });

  describe("issuesToDiagnostics", () => {
    const lines = ["x = 1", "y = mystery"];

    function getLineText(line: number): string {
      return lines[line] ?? "";
    }

    it("formats message with rule id prefix", () => {
      const issues: LintIssue[] = [{
        line: 0,
        column: 0,
        endColumn: 1,
        message: "Example issue",
        ruleId: "test-rule",
        severity: "error",
      }];
      const result = issuesToDiagnostics(issues, lines.length, getLineText);
      expect(result).to.have.lengthOf(1);
      expect(result[0].message).to.equal("[test-rule] Example issue");
    });

    it("omits issues with severity off", () => {
      const issues: LintIssue[] = [{
        line: 0,
        column: 0,
        message: "Hidden issue",
        ruleId: "hidden-rule",
        severity: "off",
      }];
      const result = issuesToDiagnostics(issues, lines.length, getLineText);
      expect(result).to.be.empty;
    });

    it("clamps columns to line length", () => {
      const issues: LintIssue[] = [{
        line: 0,
        column: 100,
        endColumn: 200,
        message: "Out of range",
        ruleId: "range-rule",
        severity: "warn",
      }];
      const result = issuesToDiagnostics(issues, lines.length, getLineText);
      expect(result[0].startColumn).to.equal(lines[0].length);
      expect(result[0].endColumn).to.be.at.least(lines[0].length);
    });

    it("clamps line index to valid range", () => {
      const issues: LintIssue[] = [{
        line: 99,
        column: 0,
        message: "Far line",
        ruleId: "line-rule",
        severity: "warn",
      }];
      const result = issuesToDiagnostics(issues, lines.length, getLineText);
      expect(result[0].line).to.equal(lines.length - 1);
    });

    it("maps multiple issues preserving order", () => {
      const issues: LintIssue[] = [
        { line: 0, column: 0, message: "First", ruleId: "rule-a", severity: "error" },
        { line: 1, column: 2, message: "Second", ruleId: "rule-b", severity: "warn" },
      ];
      const result = issuesToDiagnostics(issues, lines.length, getLineText);
      expect(result).to.have.lengthOf(2);
      expect(result[0].ruleId).to.equal("rule-a");
      expect(result[1].ruleId).to.equal("rule-b");
    });

    it("assigns error severity to mapped diagnostics", () => {
      const issues: LintIssue[] = [{
        line: 0, column: 0, message: "Critical", ruleId: "err", severity: "error",
      }];
      const result = issuesToDiagnostics(issues, lines.length, getLineText);
      expect(result[0].severity).to.equal(DiagnosticSeverity.Error);
    });

    it("assigns warning severity to mapped diagnostics", () => {
      const issues: LintIssue[] = [{
        line: 0, column: 0, message: "Minor", ruleId: "warn", severity: "warn",
      }];
      const result = issuesToDiagnostics(issues, lines.length, getLineText);
      expect(result[0].severity).to.equal(DiagnosticSeverity.Warning);
    });

    it("returns empty array when given no issues", () => {
      const result = issuesToDiagnostics([], lines.length, getLineText);
      expect(result).to.be.empty;
    });

    it("uses default end column when endColumn is omitted", () => {
      const issues: LintIssue[] = [{
        line: 0, column: 2, message: "No end", ruleId: "rule", severity: "warn",
      }];
      const result = issuesToDiagnostics(issues, lines.length, getLineText);
      expect(result[0].endColumn).to.equal(3);
    });
  });
});
