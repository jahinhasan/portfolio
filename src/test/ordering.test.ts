import { describe, expect, it } from "vitest";
import { arrayMove, deviationFromCanonical, resolveOrder, resolveProjectOrder, resolveSectionOrder } from "@/lib/ordering";

describe("arrayMove", () => {
  it("moves an item forward", () => {
    expect(arrayMove(["a", "b", "c", "d"], 0, 2)).toEqual(["b", "c", "a", "d"]);
  });

  it("moves an item backward", () => {
    expect(arrayMove(["a", "b", "c", "d"], 3, 1)).toEqual(["a", "d", "b", "c"]);
  });

  it("does not mutate the input", () => {
    const input = [1, 2, 3];
    arrayMove(input, 0, 2);
    expect(input).toEqual([1, 2, 3]);
  });

  it("clamps out-of-range indices", () => {
    expect(arrayMove(["a", "b"], -5, 99)).toEqual(["b", "a"]);
  });

  it("returns an equal list for no-op moves", () => {
    expect(arrayMove(["a", "b"], 1, 1)).toEqual(["a", "b"]);
  });
});

describe("resolveOrder", () => {
  const canonical = ["x", "y", "z"] as const;

  it("returns canonical order for non-arrays", () => {
    expect(resolveOrder(undefined, canonical)).toEqual(["x", "y", "z"]);
    expect(resolveOrder("nope", canonical)).toEqual(["x", "y", "z"]);
    expect(resolveOrder(null, canonical)).toEqual(["x", "y", "z"]);
  });

  it("applies a valid stored permutation", () => {
    expect(resolveOrder(["z", "x", "y"], canonical)).toEqual(["z", "x", "y"]);
  });

  it("drops unknown entries", () => {
    expect(resolveOrder(["z", "hacked", "x"], canonical)).toEqual(["z", "x", "y"]);
  });

  it("appends missing canonical entries at the end", () => {
    expect(resolveOrder(["z"], canonical)).toEqual(["z", "x", "y"]);
  });

  it("deduplicates keeping the first occurrence", () => {
    expect(resolveOrder(["y", "y", "x"], canonical)).toEqual(["y", "x", "z"]);
  });

  it("ignores non-string entries", () => {
    expect(resolveOrder([1, "x", null, "z"], canonical)).toEqual(["x", "z", "y"]);
  });
});

describe("resolvers against site data", () => {
  it("section resolver always returns all ten sections", () => {
    const result = resolveSectionOrder(["contact", "garbage"]);
    expect(result).toHaveLength(10);
    expect(result[0]).toBe("contact");
    expect(new Set(result).size).toBe(10);
  });

  it("project resolver keeps every project even when stored order is stale", () => {
    const result = resolveProjectOrder(["shopsync"]);
    expect(result[0]).toBe("shopsync");
    expect(result).toHaveLength(12); // full catalog incl. projects added later
  });

  it("project resolver returns the default order for garbage input", () => {
    expect(resolveProjectOrder(42)).toHaveLength(12);
  });
});

describe("deviationFromCanonical", () => {
  it("counts positional differences", () => {
    expect(deviationFromCanonical(["a", "b", "c"], ["a", "b", "c"])).toBe(0);
    expect(deviationFromCanonical(["c", "b", "a"], ["a", "b", "c"])).toBe(2);
  });
});
