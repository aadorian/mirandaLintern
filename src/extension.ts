import * as vscode from "vscode";
import { MirandaLintProvider } from "./linter/provider";
import { registerViews, openExtensionFile } from "./views/registerViews";
import { registerStatusBar } from "./statusBar";

const WALKTHROUGH_ID = "AlejandroAdorjan.mirandaCode#miranda-getting-started";

async function openWalkthrough(): Promise<void> {
  await vscode.commands.executeCommand("workbench.action.openWalkthrough", WALKTHROUGH_ID);
}

export function activate(context: vscode.ExtensionContext): void {
  const lintProvider = new MirandaLintProvider();

  const openBasicExample = () => openExtensionFile(context, "examples/01-basic-ideas.m");
  const openComprehensionsExample = () =>
    openExtensionFile(context, "examples/05-list-comprehensions.m");
  const openFibExample = () => openExtensionFile(context, "examples/fib.m");
  const openLanguageGuide = () => openExtensionFile(context, "docs/walkthrough.md");
  const openLintSettings = () =>
    vscode.commands.executeCommand("workbench.action.openSettings", "miranda");
  const startTutorial = async () => {
    await openExtensionFile(context, "examples/01-basic-ideas.m");
    await openWalkthrough();
  };

  const lintDocument = (document: vscode.TextDocument): void => {
    lintProvider.lintDocument(document);
  };

  const runLintOnResource = async (uri?: vscode.Uri): Promise<void> => {
    const target = uri ?? vscode.window.activeTextEditor?.document.uri;
    if (!target) {
      vscode.window.showWarningMessage("Select a Miranda (.m) file to run the linter.");
      return;
    }
    const doc = await vscode.workspace.openTextDocument(target);
    if (doc.languageId !== "miranda") {
      vscode.window.showWarningMessage("Miranda linter only runs on .m files.");
      return;
    }
    await vscode.window.showTextDocument(doc);
    lintDocument(doc);
    vscode.window.showInformationMessage("Miranda lint complete.");
  };

  context.subscriptions.push(
    lintProvider,
    vscode.commands.registerCommand("miranda.runLint", () => {
      const editor = vscode.window.activeTextEditor;
      if (editor?.document.languageId === "miranda") {
        lintDocument(editor.document);
        vscode.window.showInformationMessage("Miranda lint complete.");
      } else {
        vscode.window.showWarningMessage("Open a Miranda (.m) file to run the linter.");
      }
    }),
    vscode.commands.registerCommand("miranda.runLintOnResource", runLintOnResource),
    vscode.commands.registerCommand("miranda.startTutorial", startTutorial),
    vscode.commands.registerCommand("miranda.openBasicExample", openBasicExample),
    vscode.commands.registerCommand("miranda.openComprehensionsExample", openComprehensionsExample),
    vscode.commands.registerCommand("miranda.openFibExample", openFibExample),
    vscode.commands.registerCommand("miranda.openLanguageGuide", openLanguageGuide),
    vscode.commands.registerCommand("miranda.openLintSettings", openLintSettings),
    vscode.commands.registerCommand("miranda.openWalkthrough", openWalkthrough)
  );

  registerViews(context, lintDocument);
  registerStatusBar(context);

  if (process.env.MIRANDA_OPEN_WALKTHROUGH === "1") {
    void startTutorial();
  }
}

export function deactivate(): void {
  // disposables cleaned up via context.subscriptions
}
