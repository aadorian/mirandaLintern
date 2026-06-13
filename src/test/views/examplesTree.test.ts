import { expect } from "chai";
import {
  EXAMPLE_ENTRIES,
  EXAMPLE_GROUPS,
  getExampleById,
  getExamplesForGroup,
} from "../../views/examplesTree";

describe("examplesTree manifest", () => {
  it("defines three example groups", () => {
    expect(EXAMPLE_GROUPS).to.have.lengthOf(3);
    expect(EXAMPLE_GROUPS.map((g) => g.id)).to.deep.equal(["tutorial", "official", "modules"]);
  });

  it("lists all tutorial examples 01 through 10", () => {
    const tutorial = getExamplesForGroup("tutorial");
    expect(tutorial).to.have.lengthOf(10);
    expect(tutorial[0].path).to.equal("examples/01-basic-ideas.m");
    expect(tutorial[9].path).to.equal("examples/10-abstract-data-types.m");
  });

  it("includes official repo examples", () => {
    const official = getExamplesForGroup("official");
    expect(official.map((e) => e.id)).to.deep.equal(["fib", "quicksort"]);
  });

  it("includes module examples", () => {
    const modules = getExamplesForGroup("modules");
    expect(modules).to.have.lengthOf(2);
    expect(modules.every((e) => e.path.startsWith("examples/modules/"))).to.be.true;
  });

  it("resolves example by id", () => {
    const entry = getExampleById("05");
    expect(entry?.label).to.include("List comprehensions");
    expect(entry?.path).to.equal("examples/05-list-comprehensions.m");
  });

  it("has unique ids across all entries", () => {
    const ids = EXAMPLE_ENTRIES.map((e) => e.id);
    expect(new Set(ids).size).to.equal(ids.length);
  });
});
