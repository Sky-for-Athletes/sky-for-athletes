import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VariableToggle from "../VariableToggle";

describe("VariableToggle", () => {
  it("renders a button for every climate variable", () => {
    render(<VariableToggle value="comfortScore" onChange={() => {}} />);
    expect(screen.getByText("Temperatura")).toBeInTheDocument();
    expect(screen.getByText("Umidade")).toBeInTheDocument();
    expect(screen.getByText("Vento")).toBeInTheDocument();
    expect(screen.getByText("Heat Index")).toBeInTheDocument();
    expect(screen.getByText("Wind Chill")).toBeInTheDocument();
    expect(screen.getByText("Conforto")).toBeInTheDocument();
  });

  it("calls onChange with the clicked variable key", async () => {
    const onChange = vi.fn();
    render(<VariableToggle value="comfortScore" onChange={onChange} />);
    await userEvent.click(screen.getByText("Umidade"));
    expect(onChange).toHaveBeenCalledWith("humidity");
  });

  it("highlights the currently selected variable", () => {
    render(<VariableToggle value="windSpeed" onChange={() => {}} />);
    expect(screen.getByText("Vento")).toHaveClass("bg-green-signal");
    expect(screen.getByText("Temperatura")).not.toHaveClass("bg-green-signal");
  });
});
