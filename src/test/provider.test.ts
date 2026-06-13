import { expect } from "chai";
import { EventEmitter } from "events";
import * as path from "path";
import mockRequire from "mock-require";

interface MockTextDocument {
  languageId: string;
  uri: { toString(): string };
  lineCount: number;
  getText(): string;
  lineAt(line: number): { text: string };
}

interface MockDiagnosticCollection {
  setCalls: Array<{ uri: unknown; diagnostics: unknown[] }>;
  deleteCalls: unknown[];
  set(uri: unknown, diagnostics: unknown[]): void;
  delete(uri: unknown): void;
  dispose(): void;
}

function createMockDocument(source: string, languageId = "miranda"): MockTextDocument {
  const lines = source.split(/\r?\n/);
  return {
    languageId,
    uri: { toString: () => "file:///test.m" },
    lineCount: lines.length,
    getText: () => source,
    lineAt: (line: number) => ({ text: lines[line] ?? "" }),
  };
}

describe("MirandaLintProvider", () => {
  let mockCollection: MockDiagnosticCollection;
  let changeEmitter: EventEmitter;
  let workspaceConfig: Record<string, unknown>;
  let MirandaLintProvider: typeof import("../linter/provider").MirandaLintProvider;

  beforeEach(() => {
    mockCollection = {
      setCalls: [],
      deleteCalls: [],
      set(uri, diagnostics) {
        this.setCalls.push({ uri, diagnostics });
      },
      delete(uri) {
        this.deleteCalls.push(uri);
      },
      dispose() {},
    };

    changeEmitter = new EventEmitter();

    workspaceConfig = {
      enable: true,
      run: "onTypeAndSave",
      maxLineLength: 80,
      indentSize: 1,
      "rules.noTrailingSpaces": "error",
      "rules.requireFinalNewline": "off",
      "rules.noTabs": "off",
      "rules.consistentIndent": "off",
      "rules.noDuplicateDefinitions": "off",
      "rules.noUndefinedIdentifier": "off",
      "rules.noUnusedDefinitions": "off",
      "rules.booleanLiteralCase": "off",
      "rules.commentStyle": "off",
      "rules.noSingleCharNames": "off",
      "rules.maxLineLength": "off",
      "rules.unmatchedQuotes": "off",
      "rules.reservedWordAsIdentifier": "off",
    };

    mockRequire("vscode", {
      languages: {
        createDiagnosticCollection: () => mockCollection,
      },
      workspace: {
        getConfiguration: () => ({
          get: <T>(key: string, defaultValue: T) =>
            (workspaceConfig[key] as T | undefined) ?? defaultValue,
        }),
        onDidChangeTextDocument: (cb: (e: { document: MockTextDocument }) => void) => {
          changeEmitter.on("change", cb);
          return { dispose() {} };
        },
        onDidSaveTextDocument: () => ({ dispose() {} }),
        onDidOpenTextDocument: () => ({ dispose() {} }),
        onDidCloseTextDocument: () => ({ dispose() {} }),
        textDocuments: [] as MockTextDocument[],
      },
      Range: class {
        startLine: number;
        startCol: number;
        endLine: number;
        endCol: number;
        constructor(startLine: number, startCol: number, endLine: number, endCol: number) {
          this.startLine = startLine;
          this.startCol = startCol;
          this.endLine = endLine;
          this.endCol = endCol;
        }
      },
      Diagnostic: class {
        range: unknown;
        message: string;
        severity: number;
        constructor(range: unknown, message: string, severity: number) {
          this.range = range;
          this.message = message;
          this.severity = severity;
        }
      },
      DiagnosticSeverity: {
        Error: 0,
        Warning: 1,
      },
    });

    const providerPath = path.resolve(process.cwd(), "out/test/linter/provider.js");
    delete require.cache[providerPath];
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    MirandaLintProvider = require(providerPath).MirandaLintProvider;
  });

  afterEach(() => {
    mockRequire.stopAll();
  });

  it("publishes diagnostics for lint issues", () => {
    const provider = new MirandaLintProvider();
    const doc = createMockDocument("x = 1  \n");

    provider.lintDocument(doc as never);

    expect(mockCollection.setCalls).to.have.lengthOf(1);
    const diagnostics = mockCollection.setCalls[0].diagnostics as Array<{ message: string }>;
    expect(diagnostics.some((d) => d.message.includes("no-trailing-spaces"))).to.be.true;
    provider.dispose();
  });

  it("clears diagnostics when linting is disabled", () => {
    workspaceConfig.enable = false;
    const provider = new MirandaLintProvider();
    const doc = createMockDocument("x = 1  \n");

    provider.lintDocument(doc as never);

    expect(mockCollection.deleteCalls).to.have.lengthOf(1);
    expect(mockCollection.setCalls).to.be.empty;
    provider.dispose();
  });

  it("ignores non-miranda documents on text change", async () => {
    const provider = new MirandaLintProvider();
    const doc = createMockDocument("x = 1  \n", "plaintext");

    changeEmitter.emit("change", { document: doc });
    await new Promise((resolve) => setTimeout(resolve, 350));

    expect(mockCollection.setCalls).to.be.empty;
    provider.dispose();
  });
});
