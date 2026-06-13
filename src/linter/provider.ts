import * as vscode from "vscode";
import { buildLintConfig } from "./config";
import { issuesToDiagnostics } from "./diagnostics";
import { lintMiranda } from "./linter";

const DIAGNOSTIC_SOURCE = "miranda";

function getLintConfig() {
  const cfg = vscode.workspace.getConfiguration("miranda.lint");
  return buildLintConfig({
    get: <T>(key: string, defaultValue: T) => cfg.get<T>(key, defaultValue),
  });
}

export class MirandaLintProvider implements vscode.Disposable {
  private readonly collection: vscode.DiagnosticCollection;
  private readonly disposables: vscode.Disposable[] = [];
  private debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor() {
    this.collection = vscode.languages.createDiagnosticCollection(DIAGNOSTIC_SOURCE);

    const runMode = () => vscode.workspace.getConfiguration("miranda.lint").get<string>("run", "onTypeAndSave");

    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.document.languageId !== "miranda") {
          return;
        }
        const mode = runMode();
        if (mode === "onType" || mode === "onTypeAndSave") {
          this.scheduleLint(e.document);
        }
      }),
      vscode.workspace.onDidSaveTextDocument((doc) => {
        if (doc.languageId !== "miranda") {
          return;
        }
        const mode = runMode();
        if (mode === "onSave" || mode === "onTypeAndSave") {
          this.lintDocument(doc);
        }
      }),
      vscode.workspace.onDidCloseTextDocument((doc) => {
        this.collection.delete(doc.uri);
        const timer = this.debounceTimers.get(doc.uri.toString());
        if (timer) {
          clearTimeout(timer);
          this.debounceTimers.delete(doc.uri.toString());
        }
      }),
      vscode.workspace.onDidOpenTextDocument((doc) => {
        if (doc.languageId === "miranda") {
          this.scheduleLint(doc);
        }
      })
    );

    for (const doc of vscode.workspace.textDocuments) {
      if (doc.languageId === "miranda") {
        this.scheduleLint(doc);
      }
    }
  }

  lintDocument(document: vscode.TextDocument): void {
    const config = getLintConfig();
    if (!config.enable) {
      this.collection.delete(document.uri);
      return;
    }

    const issues = lintMiranda(document.getText(), config);
    const mapped = issuesToDiagnostics(
      issues,
      document.lineCount,
      (line) => document.lineAt(line).text
    );

    const diagnostics: vscode.Diagnostic[] = mapped.map((item) => {
      const range = new vscode.Range(item.line, item.startColumn, item.line, item.endColumn);
      const vscodeSeverity = item.severity === 0
        ? vscode.DiagnosticSeverity.Error
        : vscode.DiagnosticSeverity.Warning;
      const diagnostic = new vscode.Diagnostic(range, item.message, vscodeSeverity);
      diagnostic.source = DIAGNOSTIC_SOURCE;
      diagnostic.code = item.ruleId;
      return diagnostic;
    });

    this.collection.set(document.uri, diagnostics);
  }

  private scheduleLint(document: vscode.TextDocument): void {
    const key = document.uri.toString();
    const existing = this.debounceTimers.get(key);
    if (existing) {
      clearTimeout(existing);
    }
    this.debounceTimers.set(
      key,
      setTimeout(() => {
        this.debounceTimers.delete(key);
        this.lintDocument(document);
      }, 300)
    );
  }

  dispose(): void {
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
    this.collection.dispose();
    for (const d of this.disposables) {
      d.dispose();
    }
  }
}
