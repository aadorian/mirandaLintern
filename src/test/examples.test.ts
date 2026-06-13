import * as fs from "fs";
import * as path from "path";
import { expect } from "chai";
import { lint } from "./helpers";

function collectExampleFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectExampleFiles(fullPath));
    } else if (entry.name.endsWith(".m")) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

describe("example scripts", () => {
  const examplesDir = path.join(process.cwd(), "examples");
  const exampleFiles = collectExampleFiles(examplesDir);

  for (const filePath of exampleFiles) {
    const relativePath = path.relative(process.cwd(), filePath);

    it(`${relativePath} has no error-severity lint issues`, () => {
      const source = fs.readFileSync(filePath, "utf8");
      const issues = lint(source);
      const errors = issues.filter((issue) => issue.severity === "error");

      expect(
        errors,
        errors.map((e) => `${e.ruleId} at line ${e.line + 1}: ${e.message}`).join("\n")
      ).to.be.empty;
    });
  }
});
