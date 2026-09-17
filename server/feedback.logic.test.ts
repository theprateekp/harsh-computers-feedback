import { describe, expect, it } from "vitest";
import { deriveSentiment, getNpsBucket } from "./routers";

describe("feedback analysis", () => {
  it("classifies strongly positive service language as positive", () => {
    expect(deriveSentiment(5, "Excellent service, fast turnaround and helpful staff")).toBe("positive");
  });

  it("prioritizes low ratings and negative language", () => {
    expect(deriveSentiment(2, "The repair was delayed and expensive")).toBe("negative");
  });

  it("keeps an unqualified middle response neutral", () => {
    expect(deriveSentiment(3, "It was okay")).toBe("neutral");
  });

  it("maps NPS scores to promoters, passives, and detractors", () => {
    expect(getNpsBucket(10)).toBe("promoters");
    expect(getNpsBucket(8)).toBe("passives");
    expect(getNpsBucket(6)).toBe("detractors");
  });
});
