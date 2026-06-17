import type { VariableKey } from "../types/weather";

const variableRanges: Record<VariableKey, { min: number; max: number }> = {
  temperature: { min: 0, max: 40 },
  humidity: { min: 0, max: 100 },
  windSpeed: { min: 0, max: 50 },
  heatIndex: { min: 0, max: 50 },
  windChill: { min: -10, max: 40 },
  comfortScore: { min: 0, max: 100 },
};

export function getVariableColor(variable: VariableKey, value: number): string {
  const range = variableRanges[variable];
  let t = (value - range.min) / (range.max - range.min);
  t = Math.max(0, Math.min(1, t));

  if (variable === "comfortScore") t = 1 - t;

  const hue = Math.round(120 - t * 120);
  return `hsl(${hue}, 80%, 50%)`;
}
