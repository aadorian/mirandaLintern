import * as vscode from "vscode";
import { Concept, CONCEPTS, getConceptById } from "./concepts";

export type ConceptTreeNode = ConceptGroupNode | ConceptActionNode | ConceptTopicNode;

export interface ConceptGroupNode {
  kind: "group";
  id: string;
  label: string;
}

export interface ConceptActionNode {
  kind: "action";
  id: string;
  label: string;
  command: string;
  icon: string;
}

export interface ConceptTopicNode {
  kind: "topic";
  concept: Concept;
}

const QUICK_START: ConceptActionNode[] = [
  { kind: "action", id: "start", label: "Start Tutorial", command: "miranda.startTutorial", icon: "rocket" },
  { kind: "action", id: "walkthrough", label: "Open Walkthrough", command: "miranda.openWalkthrough", icon: "book" },
  { kind: "action", id: "guide", label: "Full Language Guide", command: "miranda.openLanguageGuide", icon: "markdown" },
];

export class ConceptsTreeProvider implements vscode.TreeDataProvider<ConceptTreeNode> {
  getTreeItem(element: ConceptTreeNode): vscode.TreeItem {
    if (element.kind === "group") {
      const item = new vscode.TreeItem(element.label, vscode.TreeItemCollapsibleState.Expanded);
      item.iconPath = new vscode.ThemeIcon("folder");
      item.id = element.id;
      return item;
    }

    if (element.kind === "action") {
      const item = new vscode.TreeItem(element.label, vscode.TreeItemCollapsibleState.None);
      item.iconPath = new vscode.ThemeIcon(element.icon);
      item.contextValue = "mirandaConceptAction";
      item.command = { command: element.command, title: element.label };
      return item;
    }

    const { concept } = element;
    const item = new vscode.TreeItem(
      `${concept.number}. ${concept.title}`,
      vscode.TreeItemCollapsibleState.None
    );
    item.description = concept.summary;
    item.tooltip = new vscode.MarkdownString(
      `**${concept.title}**\n\n${concept.summary}\n\n_${concept.reference ?? ""}_`
    );
    item.iconPath = new vscode.ThemeIcon("symbol-class");
    item.contextValue = `mirandaConcept:${concept.id}`;
    item.command = {
      command: "miranda.showConcept",
      title: "Show Concept",
      arguments: [concept.id],
    };
    return item;
  }

  getChildren(element?: ConceptTreeNode): ConceptTreeNode[] {
    if (!element) {
      return [
        { kind: "group", id: "quick-start", label: "Quick Start" },
        { kind: "group", id: "topics", label: "Language Concepts" },
      ];
    }

    if (element.kind === "group" && element.id === "quick-start") {
      return QUICK_START;
    }

    if (element.kind === "group" && element.id === "topics") {
      return CONCEPTS.map((concept) => ({ kind: "topic" as const, concept }));
    }

    return [];
  }

  getConcept(id: string): Concept | undefined {
    return getConceptById(id);
  }
}
