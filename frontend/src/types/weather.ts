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
