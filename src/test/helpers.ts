import { expect } from "chai";
import { DEFAULT_LINT_CONFIG, LintConfig, LintIssue, RuleSeverity } from "../linter/constants";
import { lintMiranda } from "../linter/linter";

export function createConfig(overrides: Partial<LintConfig> & { rules?: Partial<Record<string, RuleSeverity>> } = {}): LintConfig {
  return {
    ...DEFAULT_LINT_CONFIG,
    ...overrides,
    rules: {
      ...DEFAULT_LINT_CONFIG.rules,
      ...overrides.rules,
    },
  };
}

export function createConfigWithOnlyRule(ruleId: string, severity: RuleSeverity = "error"): LintConfig {
  const rules = Object.fromEntries(
    Object.keys(DEFAULT_LINT_CONFIG.rules).map((key) => [key, "off" as RuleSeverity])
  ) as Record<string, RuleSeverity>;
  rules[ruleId] = severity;
  return createConfig({ rules });
}

export function lint(source: string, config?: Partial<LintConfig> & { rules?: Partial<Record<string, RuleSeverity>> }): LintIssue[] {
  return lintMiranda(source, createConfig(config));
}

export function findRule(issues: LintIssue[], ruleId: string): LintIssue[] {
  return issues.filter((issue) => issue.ruleId === ruleId);
}

export function assertHasRule(issues: LintIssue[], ruleId: string): void {
  expect(findRule(issues, ruleId), `expected rule '${ruleId}' to be reported`).to.not.be.empty;
}

export function assertNoRule(issues: LintIssue[], ruleId: string): void {
  expect(findRule(issues, ruleId), `expected rule '${ruleId}' not to be reported`).to.be.empty;
}
