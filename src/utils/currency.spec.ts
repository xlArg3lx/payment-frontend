import { describe, it, expect } from "vitest";
import { formatCurrency } from "./currency";

describe("formatCurrency", () => {
  it("should format cents to COP currency", () => {
    const result = formatCurrency(350000000);
    expect(result).toContain("3.500.000");
  });

  it("should format zero correctly", () => {
    const result = formatCurrency(0);
    expect(result).toContain("0");
  });

  it("should format small amounts", () => {
    const result = formatCurrency(100);
    expect(result).toContain("1");
  });

  it("should include COP currency symbol", () => {
    const result = formatCurrency(100000);
    expect(result).toContain("$");
  });

  it("should format base fee correctly", () => {
    const result = formatCurrency(300000);
    expect(result).toContain("3.000");
  });
});
