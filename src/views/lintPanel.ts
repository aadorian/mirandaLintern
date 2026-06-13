import * as vscode from "vscode";
import {
  diagnosticsToIssueNodes,
  LintIssueNode,
  MIRANDA_DIAGNOSTIC_SOURCE,
} from "./lintPanelUtils";

export { countDiagnosticsBySeverity, MIRANDA_DIAGNOSTIC_SOURCE } from "./lintPanelUtils";
export type { LintIssueNode } from "./lintPanelUtils";

export class LintPanelProvider implements vscode.TreeDataProvider<LintIssueNode> {
  private readonly emitter = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this.emitter.event;

  constructor() {
    vscode.languages.onDidChangeDiagnostics(() => this.emitter.fire());
    vscode.window.onDidChangeActiveTextEditor(() => this.emitter.fire());
  }

  getTreeItem(element: LintIssueNode): vscode.TreeItem {
    const item = new vscode.TreeItem(element.label);
    const icon = element.severity === vscode.DiagnosticSeverity.Error
      ? new vscode.ThemeIcon("error")
      : new vscode.ThemeIcon("warning");
    item.iconPath = icon;
    item.contextValue = "mirandaLintIssue";
    item.command = {
      command: "miranda.goToLintIssue",
      title: "Go to Issue",
      arguments: [element.line, element.column],
    };
    return item;
  }

  getChildren(): LintIssueNode[] {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== "miranda") {
      return [];
    }
    const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
    return diagnosticsToIssueNodes(diagnostics);
  }

  refresh(): void {
    this.emitter.fire();
  }
}
