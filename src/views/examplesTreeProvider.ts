import * as vscode from "vscode";
import {
  EXAMPLE_ENTRIES,
  EXAMPLE_GROUPS,
  ExampleEntry,
  getExamplesForGroup,
} from "./examplesTree";

export type ExamplesTreeNode = ExampleGroupNode | ExampleFileNode;

export interface ExampleGroupNode {
  kind: "group";
  id: string;
  label: string;
}

export interface ExampleFileNode {
  kind: "file";
  entry: ExampleEntry;
}

export class ExamplesTreeProvider implements vscode.TreeDataProvider<ExamplesTreeNode> {
  constructor(private readonly extensionUri: vscode.Uri) {}

  getTreeItem(element: ExamplesTreeNode): vscode.TreeItem {
    if (element.kind === "group") {
      const item = new vscode.TreeItem(element.label, vscode.TreeItemCollapsibleState.Expanded);
      item.iconPath = new vscode.ThemeIcon("folder");
      item.id = element.id;
      return item;
    }

    const item = new vscode.TreeItem(element.entry.label, vscode.TreeItemCollapsibleState.None);
    item.iconPath = new vscode.ThemeIcon("file");
    item.contextValue = `mirandaExample:${element.entry.path}`;
    item.command = {
      command: "miranda.openExampleFile",
      title: "Open Example",
      arguments: [element.entry.path],
    };
    return item;
  }

  getChildren(element?: ExamplesTreeNode): ExamplesTreeNode[] {
    if (!element) {
      return EXAMPLE_GROUPS.map((group) => ({
        kind: "group" as const,
        id: group.id,
        label: group.label,
      }));
    }

    if (element.kind === "group") {
      return getExamplesForGroup(element.id).map((entry) => ({
        kind: "file" as const,
        entry,
      }));
    }

    return [];
  }

  getEntryPath(id: string): string | undefined {
    return EXAMPLE_ENTRIES.find((e) => e.id === id)?.path;
  }
}
