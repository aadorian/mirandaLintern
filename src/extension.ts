import * as vscode from "vscode";
import { MirandaLintProvider } from "./linter/provider";

let lintProvider: MirandaLintProvider | undefined;

const WALKTHROUGH_ID = "miranda-lang.miranda#miranda-getting-started";

async function openExtensionFile(
  context: vscode.ExtensionContext,
  relativePath: string
): Promise<void> {
  const uri = vscode.Uri.joinPath(context.extensionUri, ...relativePath.split("/"));
  await vscode.commands.executeCommand("vscode.open", uri);
}

async function openWalkthrough(): Promise<void> {
  await vscode.commands.executeCommand("workbench.action.openWalkthrough", WALKTHROUGH_ID);
}

function registerStatusBarButtons(context: vscode.ExtensionContext): void {
  const startTutorialButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  startTutorialButton.text = "$(rocket) Miranda Tutorial";
  startTutorialButton.command = "miranda.startTutorial";
  startTutorialButton.tooltip = "Open a Miranda example and the Get Started walkthrough";
  startTutorialButton.show();

  const walkthroughButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    99
  );
  walkthroughButton.text = "$(book) Miranda Guide";
  walkthroughButton.command = "miranda.openWalkthrough";
  walkthroughButton.tooltip = "Open the Get Started with Miranda walkthrough";
  walkthroughButton.show();

  const lintButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 98);
  lintButton.text = "$(debug-start) Run Miranda Lint";
  lintButton.command = "miranda.runLint";
  lintButton.tooltip = "Run the Miranda linter on the active file";

  const syncLintButtonVisibility = (): void => {
    const editor = vscode.window.activeTextEditor;
    if (editor?.document.languageId === "miranda") {
      lintButton.show();
    } else {
      lintButton.hide();
    }
  };

  syncLintButtonVisibility();
  context.subscriptions.push(
    startTutorialButton,
    walkthroughButton,
    lintButton,
    vscode.window.onDidChangeActiveTextEditor(syncLintButtonVisibility)
  );
}

export function activate(context: vscode.ExtensionContext): void {
  lintProvider = new MirandaLintProvider();

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
    }),
    vscode.commands.registerCommand("miranda.startTutorial", startTutorial),
    vscode.commands.registerCommand("miranda.openBasicExample", openBasicExample),
    vscode.commands.registerCommand("miranda.openComprehensionsExample", openComprehensionsExample),
    vscode.commands.registerCommand("miranda.openFibExample", openFibExample),
    vscode.commands.registerCommand("miranda.openLanguageGuide", openLanguageGuide),
    vscode.commands.registerCommand("miranda.openLintSettings", openLintSettings),
    vscode.commands.registerCommand("miranda.openWalkthrough", openWalkthrough)
  );

  registerStatusBarButtons(context);

  if (process.env.MIRANDA_OPEN_WALKTHROUGH === "1") {
    void startTutorial();
  }
}

export function deactivate(): void {
  lintProvider?.dispose();
  lintProvider = undefined;
}
