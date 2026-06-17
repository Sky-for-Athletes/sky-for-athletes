import { describe, it, expect } from "vitest";
import { nominatimCity } from "../nominatim";

describe("nominatimCity", () => {
  it("prefers city over other address fields", () => {
    expect(
      nominatimCity({
        lat: "0",
        lon: "0",
        display_name: "",
        address: { city: "Fortaleza", state: "Ceará" },
      })
    ).toBe("Fortaleza");
  });

  it("falls back through town/village/municipality/county/state", () => {
    expect(nominatimCity({ lat: "0", lon: "0", display_name: "", address: { town: "A" } })).toBe("A");
    expect(nominatimCity({ lat: "0", lon: "0", display_name: "", address: { village: "B" } })).toBe("B");
    expect(nominatimCity({ lat: "0", lon: "0", display_name: "", address: { state: "C" } })).toBe("C");
  });

  it("returns an empty string when there is no usable address field", () => {
    expect(nominatimCity({ lat: "0", lon: "0", display_name: "" })).toBe("");
  });
});
