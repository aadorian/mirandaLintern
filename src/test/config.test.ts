import { expect } from "chai";
import { buildLintConfig } from "../linter/config";
import { DEFAULT_LINT_CONFIG } from "../linter/constants";

describe("buildLintConfig", () => {
  it("returns defaults when no overrides are provided", () => {
    const config = buildLintConfig({
      get: <T>(_key: string, defaultValue: T) => defaultValue,
    });

    expect(config.enable).to.equal(DEFAULT_LINT_CONFIG.enable);
    expect(config.maxLineLength).to.equal(DEFAULT_LINT_CONFIG.maxLineLength);
    expect(config.indentSize).to.equal(DEFAULT_LINT_CONFIG.indentSize);
    expect(config.rules.booleanLiteralCase).to.equal("error");
    expect(config.rules.noSingleCharNames).to.equal("off");
  });

  it("applies workspace overrides for top-level settings", () => {
    const config = buildLintConfig({
      get: <T>(key: string, defaultValue: T) => {
        if (key === "enable") return false as T;
        if (key === "maxLineLength") return 120 as T;
        if (key === "indentSize") return 2 as T;
        return defaultValue;
      },
    });

    expect(config.enable).to.be.false;
    expect(config.maxLineLength).to.equal(120);
    expect(config.indentSize).to.equal(2);
  });

  it("applies workspace overrides for individual rules", () => {
    const config = buildLintConfig({
      get: <T>(key: string, defaultValue: T) => {
        if (key === "rules.noTrailingSpaces") return "error" as T;
        if (key === "rules.noUndefinedIdentifier") return "off" as T;
        return defaultValue;
      },
    });

    expect(config.rules.noTrailingSpaces).to.equal("error");
    expect(config.rules.noUndefinedIdentifier).to.equal("off");
    expect(config.rules.booleanLiteralCase).to.equal(DEFAULT_LINT_CONFIG.rules.booleanLiteralCase);
  });

  it("returns all 13 rule keys from defaults", () => {
    const config = buildLintConfig({
      get: <T>(_key: string, defaultValue: T) => defaultValue,
    });
    expect(Object.keys(config.rules)).to.have.lengthOf(13);
  });

  it("allows turning every rule off individually", () => {
    const config = buildLintConfig({
      get: <T>(key: string, defaultValue: T) => {
        if (key.startsWith("rules.")) {
          return "off" as T;
        }
        return defaultValue;
      },
    });
    for (const severity of Object.values(config.rules)) {
      expect(severity).to.equal("off");
    }
  });
});
