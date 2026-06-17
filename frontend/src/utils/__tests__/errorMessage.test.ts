import { describe, it, expect } from "vitest";
import { AxiosError } from "axios";
import { getErrorMessage } from "../errorMessage";

describe("getErrorMessage", () => {
  it("extracts the server-provided error message from an axios error", () => {
    const err = new AxiosError("Request failed");
    err.response = {
      data: { error: "Credenciais inválidas" },
      status: 401,
      statusText: "Unauthorized",
      headers: {},
      config: {} as never,
    };
    expect(getErrorMessage(err, "fallback")).toBe("Credenciais inválidas");
  });

  it("falls back to the axios error message when there's no response payload", () => {
    const err = new AxiosError("Network Error");
    expect(getErrorMessage(err, "fallback")).toBe("Network Error");
  });

  it("uses the message from a plain Error", () => {
    expect(getErrorMessage(new Error("boom"), "fallback")).toBe("boom");
  });

  it("uses the fallback for non-Error values", () => {
    expect(getErrorMessage("just a string", "fallback")).toBe("fallback");
    expect(getErrorMessage(undefined, "fallback")).toBe("fallback");
  });
});
