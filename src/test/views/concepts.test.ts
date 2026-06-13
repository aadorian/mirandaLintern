import { expect } from "chai";
import { CONCEPTS, getConceptById } from "../../views/concepts";

describe("concepts manifest", () => {
  it("defines 12 Turner overview topics", () => {
    expect(CONCEPTS).to.have.lengthOf(12);
    expect(CONCEPTS[0].id).to.equal("basic-ideas");
    expect(CONCEPTS[11].id).to.equal("modules");
  });

  it("numbers concepts sequentially from 1 to 12", () => {
    const numbers = CONCEPTS.map((c) => c.number);
    expect(numbers).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("includes summary and body for every concept", () => {
    for (const concept of CONCEPTS) {
      expect(concept.summary.length).to.be.greaterThan(5);
      expect(concept.body.length).to.be.greaterThan(20);
    }
  });

  it("links tutorial concepts to example files", () => {
    const withExamples = CONCEPTS.filter((c) => c.examplePath);
    expect(withExamples.length).to.equal(12);
    expect(withExamples.every((c) => c.examplePath!.startsWith("examples/"))).to.be.true;
  });

  it("resolves concept by id", () => {
    const concept = getConceptById("comprehensions");
    expect(concept?.title).to.equal("List Comprehensions");
    expect(concept?.number).to.equal(6);
  });
});
