import * as vscode from "vscode";
import { Concept, getConceptById } from "./concepts";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildConceptHtml(concept: Concept): string {
  const codeBlock = concept.codeSample
    ? `<pre><code>${escapeHtml(concept.codeSample)}</code></pre>`
    : "";
  const exampleButton = concept.examplePath
    ? `<button class="action" data-action="open-example" data-path="${escapeHtml(concept.examplePath)}">Open Example</button>`
    : "";
  const reference = concept.reference
    ? `<p class="reference">${escapeHtml(concept.reference)} · <a href="https://www.cs.kent.ac.uk/people/staff/dat/miranda/Overview.html">Turner Overview</a></p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      background: var(--vscode-editor-background);
      line-height: 1.55;
      padding: 16px 20px;
      margin: 0;
    }
    h1 { font-size: 1.35em; font-weight: 600; margin: 0 0 4px; }
    .summary {
      color: var(--vscode-descriptionForeground);
      font-size: 0.95em;
      margin: 0 0 16px;
    }
    p { margin: 0 0 12px; }
    pre {
      background: var(--vscode-textCodeBlock-background);
      border: 1px solid var(--vscode-panel-border, transparent);
      border-radius: 4px;
      padding: 12px;
      overflow-x: auto;
      font-family: var(--vscode-editor-font-family);
      font-size: 0.9em;
      margin: 12px 0;
    }
    code { font-family: var(--vscode-editor-font-family); }
    .actions { display: flex; gap: 8px; margin: 16px 0; flex-wrap: wrap; }
    button.action {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      border-radius: 2px;
      padding: 6px 14px;
      cursor: pointer;
      font-family: inherit;
      font-size: inherit;
    }
    button.action:hover { background: var(--vscode-button-hoverBackground); }
    button.secondary {
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
    }
    .reference {
      margin-top: 20px;
      padding-top: 12px;
      border-top: 1px solid var(--vscode-panel-border, rgba(128,128,128,0.35));
      font-size: 0.85em;
      color: var(--vscode-descriptionForeground);
    }
    a { color: var(--vscode-textLink-foreground); }
    .badge {
      display: inline-block;
      background: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
      font-size: 0.75em;
      padding: 2px 8px;
      border-radius: 10px;
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  <span class="badge">Concept ${concept.number}</span>
  <h1>${escapeHtml(concept.title)}</h1>
  <p class="summary">${escapeHtml(concept.summary)}</p>
  <p>${escapeHtml(concept.body)}</p>
  ${codeBlock}
  <div class="actions">
    ${exampleButton}
    <button class="action secondary" data-action="open-walkthrough">VS Code Walkthrough</button>
  </div>
  ${reference}
  <script>
    const vscode = acquireVsCodeApi();
    document.querySelectorAll('button[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        const path = btn.getAttribute('data-path');
        vscode.postMessage({ action, path });
      });
    });
  </script>
</body>
</html>`;
}

function buildWelcomeHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: var(--vscode-font-family);
      color: var(--vscode-foreground);
      background: var(--vscode-editor-background);
      padding: 20px;
      line-height: 1.6;
    }
    h2 { font-size: 1.1em; margin: 0 0 12px; }
    p { color: var(--vscode-descriptionForeground); margin: 0 0 12px; }
    ul { padding-left: 20px; margin: 0; }
    li { margin-bottom: 6px; }
  </style>
</head>
<body>
  <h2>Miranda Concept Guide</h2>
  <p>Select a concept from the sidebar <strong>Concepts</strong> view to read an explanation here.</p>
  <p>This panel follows the <a href="https://code.visualstudio.com/api/ux-guidelines/panel">VS Code Panel guidelines</a> — supporting material that complements your editor.</p>
  <ul>
    <li>12 topics from David Turner overview</li>
    <li>Code samples and runnable examples</li>
    <li>Lint issues in the adjacent <strong>Lint Issues</strong> tab</li>
  </ul>
</body>
</html>`;
}

export class ConceptDetailPanelProvider implements vscode.WebviewViewProvider {
  private view?: vscode.WebviewView;

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [],
    };

    webviewView.webview.onDidReceiveMessage((message: { action: string; path?: string }) => {
      if (message.action === "open-example" && message.path) {
        void vscode.commands.executeCommand("miranda.openExampleFile", message.path);
      }
      if (message.action === "open-walkthrough") {
        void vscode.commands.executeCommand("miranda.openWalkthrough");
      }
    });

    this.showWelcome();
  }

  showConcept(conceptId: string): void {
    const concept = getConceptById(conceptId);
    if (!concept || !this.view) {
      return;
    }
    this.view.webview.html = buildConceptHtml(concept);
    this.view.show?.(true);
  }

  showWelcome(): void {
    if (this.view) {
      this.view.webview.html = buildWelcomeHtml();
    }
  }
}
