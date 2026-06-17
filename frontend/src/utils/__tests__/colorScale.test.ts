import { describe, it, expect } from "vitest";
import { getVariableColor } from "../colorScale";

describe("getVariableColor", () => {
  it("returns green (hue 120) at the low end of a normal-direction range", () => {
    expect(getVariableColor("temperature", 0)).toBe("hsl(120, 80%, 50%)");
  });

  it("returns red (hue 0) at the high end of a normal-direction range", () => {
    expect(getVariableColor("temperature", 40)).toBe("hsl(0, 80%, 50%)");
  });

  it("inverts the scale for comfortScore (high score = green)", () => {
    expect(getVariableColor("comfortScore", 100)).toBe("hsl(120, 80%, 50%)");
    expect(getVariableColor("comfortScore", 0)).toBe("hsl(0, 80%, 50%)");
  });

  it("clamps values outside the range", () => {
    expect(getVariableColor("humidity", -50)).toBe(getVariableColor("humidity", 0));
    expect(getVariableColor("humidity", 500)).toBe(getVariableColor("humidity", 100));
  });
});
