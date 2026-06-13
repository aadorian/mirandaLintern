import { DEFAULT_LINT_CONFIG, LintConfig, RuleSeverity } from "./constants";

export interface WorkspaceConfigReader {
  get<T>(key: string, defaultValue: T): T;
}

export function buildLintConfig(reader: WorkspaceConfigReader): LintConfig {
  const rules: Record<string, RuleSeverity> = {};

  for (const [rule, defaultSeverity] of Object.entries(DEFAULT_LINT_CONFIG.rules)) {
    rules[rule] = reader.get<RuleSeverity>(`rules.${rule}`, defaultSeverity);
  }

  return {
    enable: reader.get<boolean>("enable", DEFAULT_LINT_CONFIG.enable),
    maxLineLength: reader.get<number>("maxLineLength", DEFAULT_LINT_CONFIG.maxLineLength),
    indentSize: reader.get<number>("indentSize", DEFAULT_LINT_CONFIG.indentSize),
    rules,
  };
}
