import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SportSelector from "../SportSelector";

describe("SportSelector", () => {
  it("lists every supported activity", () => {
    render(<SportSelector value="" onChange={() => {}} />);
    expect(screen.getByRole("option", { name: "Corrida" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Ciclismo" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Calistenia" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Surf" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Kitesurf" })).toBeInTheDocument();
  });

  it("calls onChange with the selected activity value", async () => {
    const onChange = vi.fn();
    render(<SportSelector value="" onChange={onChange} />);
    await userEvent.selectOptions(screen.getByRole("combobox"), "cycling");
    expect(onChange).toHaveBeenCalledWith("cycling");
  });
});
