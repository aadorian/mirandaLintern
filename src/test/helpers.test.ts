import { expect } from "chai";
import { DEFAULT_LINT_CONFIG } from "../linter/constants";
import {
  assertHasRule,
  assertNoRule,
  createConfig,
  createConfigWithOnlyRule,
  findRule,
  lint,
} from "./helpers";

describe("test helpers", () => {
  describe("createConfig", () => {
    it("merges top-level overrides", () => {
      const config = createConfig({ enable: false, maxLineLength: 120 });
      expect(config.enable).to.be.false;
      expect(config.maxLineLength).to.equal(120);
      expect(config.indentSize).to.equal(DEFAULT_LINT_CONFIG.indentSize);
    });

    it("merges rule overrides without dropping defaults", () => {
      const config = createConfig({
        rules: { noTabs: "error" },
      });
      expect(config.rules.noTabs).to.equal("error");
      expect(config.rules.noTrailingSpaces).to.equal(DEFAULT_LINT_CONFIG.rules.noTrailingSpaces);
    });
  });

  describe("createConfigWithOnlyRule", () => {
    it("enables only the requested rule", () => {
      const config = createConfigWithOnlyRule("noTabs", "warn");
      const enabled = Object.entries(config.rules).filter(([, severity]) => severity !== "off");
      expect(enabled).to.deep.equal([["noTabs", "warn"]]);
    });
  });

  describe("findRule and assertions", () => {
    const issues = lint("x = 1  \n", createConfigWithOnlyRule("noTrailingSpaces"));

    it("findRule returns matching issues", () => {
      expect(findRule(issues, "no-trailing-spaces")).to.have.lengthOf(1);
      expect(findRule(issues, "no-tabs")).to.be.empty;
    });

    it("assertHasRule and assertNoRule work", () => {
      expect(() => assertHasRule(issues, "no-trailing-spaces")).to.not.throw();
      expect(() => assertNoRule(issues, "no-tabs")).to.not.throw();
    });
  });
});
