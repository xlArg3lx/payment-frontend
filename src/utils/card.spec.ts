import { describe, it, expect } from "vitest";
import { detectCardBrand, formatCardNumber, formatExpiry, luhnCheck } from "./card";

describe("detectCardBrand", () => {
  it("should detect VISA when number starts with 4", () => {
    expect(detectCardBrand("4111111111111111")).toBe("VISA");
  });

  it("should detect MASTERCARD when number starts with 5", () => {
    expect(detectCardBrand("5500005555555559")).toBe("MASTERCARD");
  });

  it("should detect MASTERCARD for 2xxx range", () => {
    expect(detectCardBrand("2221000000000000")).toBe("MASTERCARD");
  });

  it("should return UNKNOWN for unrecognized number", () => {
    expect(detectCardBrand("3714496353984")).toBe("UNKNOWN");
  });

  it("should handle number with spaces", () => {
    expect(detectCardBrand("4111 1111 1111 1111")).toBe("VISA");
  });
});

describe("formatCardNumber", () => {
  it("should format 16 digits into groups of 4", () => {
    expect(formatCardNumber("4111111111111111")).toBe("4111 1111 1111 1111");
  });

  it("should remove non-numeric characters", () => {
    expect(formatCardNumber("4111-1111-1111-1111")).toBe("4111 1111 1111 1111");
  });

  it("should limit to 16 digits", () => {
    expect(formatCardNumber("41111111111111119999")).toBe("4111 1111 1111 1111");
  });

  it("should handle partial input", () => {
    expect(formatCardNumber("4111")).toBe("4111");
  });

  it("should handle empty string", () => {
    expect(formatCardNumber("")).toBe("");
  });
});

describe("formatExpiry", () => {
  it("should format 4 digits as MM/YY", () => {
    expect(formatExpiry("1229")).toBe("12/29");
  });

  it("should handle partial input under 2 digits", () => {
    expect(formatExpiry("1")).toBe("1");
  });

  it("should handle exactly 2 digits", () => {
    expect(formatExpiry("12")).toBe("12/");
  });

  it("should remove non-numeric characters", () => {
    expect(formatExpiry("12/29")).toBe("12/29");
  });

  it("should limit to 4 digits", () => {
    expect(formatExpiry("122999")).toBe("12/29");
  });
});

describe("luhnCheck", () => {
  it("should return true for valid VISA number", () => {
    expect(luhnCheck("4111111111111111")).toBe(true);
  });

  it("should return true for valid Mastercard number", () => {
    expect(luhnCheck("5500005555555559")).toBe(true);
  });

  it("should return false for invalid number", () => {
    expect(luhnCheck("1234567890123456")).toBe(false);
  });

  it("should handle number with spaces", () => {
    expect(luhnCheck("4111 1111 1111 1111")).toBe(true);
  });

  it("should return false for empty string", () => {
    expect(luhnCheck("")).toBe(false);
  });
});
