import { generateBusinessCode, isValidBusinessCode } from "../../src/utils/businessCode";

describe("businessCode utility", () => {
  it("generates codes in APEX-XXXX format", () => {
    const code = generateBusinessCode();
    expect(code).toMatch(/^APEX-[A-Z0-9]{4}$/);
  });

  it("generates unique codes", () => {
    const codes = new Set<string>();
    for (let i = 0; i < 100; i++) {
      codes.add(generateBusinessCode());
    }
    // With 30^4 = 810,000 possibilities, 100 should all be unique
    expect(codes.size).toBe(100);
  });

  it("validates correct codes", () => {
    expect(isValidBusinessCode("APEX-7K2X")).toBe(true);
    expect(isValidBusinessCode("APEX-ABCD")).toBe(true);
    expect(isValidBusinessCode("APEX-1234")).toBe(true);
  });

  it("rejects invalid codes", () => {
    expect(isValidBusinessCode("APEX-abc")).toBe(false); // lowercase
    expect(isValidBusinessCode("APEX-12345")).toBe(false); // too long
    expect(isValidBusinessCode("APEX-12")).toBe(false); // too short
    expect(isValidBusinessCode("NOPE-1234")).toBe(false); // wrong prefix
    expect(isValidBusinessCode("")).toBe(false);
  });
});
