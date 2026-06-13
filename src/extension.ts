import * as vscode from "vscode";
import { MirandaLintProvider } from "./linter/provider";

let lintProvider: MirandaLintProvider | undefined;

export function activate(context: vscode.ExtensionContext): void {
  lintProvider = new MirandaLintProvider();

  context.subscriptions.push(
    lintProvider,
    vscode.commands.registerCommand("miranda.runLint", () => {
      const editor = vscode.window.activeTextEditor;
      if (editor?.document.languageId === "miranda") {
        lintProvider?.lintDocument(editor.document);
        vscode.window.showInformationMessage("Miranda lint complete.");
      } else {
        vscode.window.showWarningMessage("Open a Miranda (.m) file to run the linter.");
      }
    })
  );
}

export function deactivate(): void {
  lintProvider?.dispose();
  lintProvider = undefined;
}
