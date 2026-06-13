import * as vscode from "vscode";

export interface GuideNode {
  id: string;
  label: string;
  command: string;
  icon?: string;
}

export const GUIDE_NODES: GuideNode[] = [
  { id: "start", label: "Start Tutorial", command: "miranda.startTutorial", icon: "rocket" },
  { id: "walkthrough", label: "Open Walkthrough", command: "miranda.openWalkthrough", icon: "book" },
  { id: "guide", label: "Language Guide", command: "miranda.openLanguageGuide", icon: "markdown" },
  { id: "settings", label: "Lint Settings", command: "miranda.openLintSettings", icon: "gear" },
];

export class GuideTreeProvider implements vscode.TreeDataProvider<GuideNode> {
  getTreeItem(element: GuideNode): vscode.TreeItem {
    const item = new vscode.TreeItem(element.label, vscode.TreeItemCollapsibleState.None);
    if (element.icon) {
      item.iconPath = new vscode.ThemeIcon(element.icon);
    }
    item.contextValue = "mirandaGuide";
    item.command = {
      command: element.command,
      title: element.label,
    };
    return item;
  }

  getChildren(): GuideNode[] {
    return GUIDE_NODES;
  }
}
