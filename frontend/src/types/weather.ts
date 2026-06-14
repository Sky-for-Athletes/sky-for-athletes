export interface IWeatherEvaluation {
  activity: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  heatIndex: number;
  windChill: number;
  comfortScore: number;
  verdict: "EXCELLENT" | "GOOD" | "MODERATE" | "POOR";
}

export interface ISportPreference {
  name: string;
  temperatureMin: number;
  temperatureMax: number;
  humidityMax: number;
  windMax: number;
  uvMax: number;
}

export type IVerdict = "EXCELLENT" | "GOOD" | "MODERATE" | "POOR";

export const ACTIVITIES = [
  "running",
  "cycling",
  "calisthenics",
  "surf",
  "kitesurf",
] as const;

export type Activity = (typeof ACTIVITIES)[number];

export const SPORT_DEFAULTS: Record<string, ISportPreference> = {
  running: { name: "running", temperatureMin: 10, temperatureMax: 30, humidityMax: 85, windMax: 25, uvMax: 8 },
  cycling: { name: "cycling", temperatureMin: 12, temperatureMax: 35, humidityMax: 75, windMax: 30, uvMax: 9 },
  calisthenics: { name: "calisthenics", temperatureMin: 15, temperatureMax: 32, humidityMax: 80, windMax: 20, uvMax: 7 },
  surf: { name: "surf", temperatureMin: 18, temperatureMax: 32, humidityMax: 90, windMax: 35, uvMax: 10 },
  kitesurf: { name: "kitesurf", temperatureMin: 20, temperatureMax: 35, humidityMax: 85, windMax: 45, uvMax: 10 },
};

export function getDefaultPreferences(sports: string[]): ISportPreference[] {
  return sports.map((s) => SPORT_DEFAULTS[s] || SPORT_DEFAULTS.running);
}
