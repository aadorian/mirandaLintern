import * as vscode from "vscode";
import { countDiagnosticsBySeverity } from "./views/lintPanel";

export class MirandaStatusBar {
  private readonly item: vscode.StatusBarItem;
  private readonly disposables: vscode.Disposable[] = [];

  constructor() {
    this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.item.name = "Miranda";
    this.disposables.push(
      this.item,
      vscode.window.onDidChangeActiveTextEditor(() => this.update()),
      vscode.languages.onDidChangeDiagnostics(() => this.update())
    );
    this.update();
  }

  private update(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== "miranda") {
      this.item.hide();
      return;
    }

    const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
    const { errors, warnings } = countDiagnosticsBySeverity(diagnostics);

    if (errors > 0 || warnings > 0) {
      const parts: string[] = [];
      if (errors > 0) {
        parts.push(`$(error) ${errors}`);
      }
      if (warnings > 0) {
        parts.push(`$(warning) ${warnings}`);
      }
      this.item.text = parts.join(" ");
      this.item.command = "miranda.showLintPanel";
      this.item.tooltip = "Miranda lint issues — click to open panel";
    } else {
      this.item.text = "Miranda";
      this.item.command = "miranda.showMirandaSidebar";
      this.item.tooltip = "Miranda — click to open sidebar";
    }

    this.item.show();
  }

  dispose(): void {
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
  }
}

export function registerStatusBar(context: vscode.ExtensionContext): void {
  const statusBar = new MirandaStatusBar();
  context.subscriptions.push(statusBar);
}
