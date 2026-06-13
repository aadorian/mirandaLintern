import * as vscode from "vscode";
import { ExamplesTreeNode, ExamplesTreeProvider } from "./examplesTreeProvider";
import { GuideTreeProvider } from "./guideTree";
import { LintIssueNode, LintPanelProvider } from "./lintPanel";

export async function openExtensionFile(
  context: vscode.ExtensionContext,
  relativePath: string
): Promise<void> {
  const uri = vscode.Uri.joinPath(context.extensionUri, ...relativePath.split("/"));
  await vscode.commands.executeCommand("vscode.open", uri);
}

export function registerViews(
  context: vscode.ExtensionContext,
  lintDocument: (document: vscode.TextDocument) => void
): {
  lintPanel: LintPanelProvider;
  lintTreeView: vscode.TreeView<LintIssueNode>;
} {
  const guideProvider = new GuideTreeProvider();
  const examplesProvider = new ExamplesTreeProvider(context.extensionUri);
  const lintPanel = new LintPanelProvider();

  const guideTreeView = vscode.window.createTreeView("miranda.guide", {
    treeDataProvider: guideProvider,
    showCollapseAll: false,
  });

  const examplesTreeView = vscode.window.createTreeView("miranda.examples", {
    treeDataProvider: examplesProvider,
    showCollapseAll: true,
  });

  const lintTreeView = vscode.window.createTreeView("miranda.lint", {
    treeDataProvider: lintPanel,
    showCollapseAll: false,
  });

  const openSelectedExample = async (): Promise<void> => {
    const selected = examplesTreeView.selection[0] as ExamplesTreeNode | undefined;
    if (!selected || selected.kind !== "file") {
      return;
    }
    await openExtensionFile(context, selected.entry.path);
  };

  const runLintOnSelectedExample = async (): Promise<void> => {
    const selected = examplesTreeView.selection[0] as ExamplesTreeNode | undefined;
    if (!selected || selected.kind !== "file") {
      return;
    }
    const uri = vscode.Uri.joinPath(context.extensionUri, ...selected.entry.path.split("/"));
    const doc = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(doc);
    lintDocument(doc);
  };

  const goToSelectedLintIssue = async (): Promise<void> => {
    const selected = lintTreeView.selection[0];
    if (!selected) {
      return;
    }
    await vscode.commands.executeCommand(
      "miranda.goToLintIssue",
      selected.line,
      selected.column
    );
  };

  context.subscriptions.push(
    guideTreeView,
    examplesTreeView,
    lintTreeView,
    vscode.commands.registerCommand("miranda.openExampleFile", async (relativePath: string) => {
      await openExtensionFile(context, relativePath);
    }),
    vscode.commands.registerCommand("miranda.openSelectedExample", openSelectedExample),
    vscode.commands.registerCommand("miranda.runLintOnSelectedExample", runLintOnSelectedExample),
    vscode.commands.registerCommand("miranda.goToLintIssue", async (line: number, column: number) => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      const position = new vscode.Position(line, column);
      editor.selection = new vscode.Selection(position, position);
      editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);
      await vscode.window.showTextDocument(editor.document, { viewColumn: editor.viewColumn });
    }),
    vscode.commands.registerCommand("miranda.goToSelectedLintIssue", goToSelectedLintIssue),
    vscode.commands.registerCommand("miranda.showLintPanel", async () => {
      await vscode.commands.executeCommand("miranda.lint.focus");
    }),
    vscode.commands.registerCommand("miranda.showMirandaSidebar", async () => {
      await vscode.commands.executeCommand("workbench.view.extension.miranda");
    })
  );

  return { lintPanel, lintTreeView };
}
