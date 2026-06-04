import api from "./api";

export interface WeatherEvaluation {
  activity: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  heatIndex: number;
  windChill: number;
  comfortScore: number;
  verdict: "EXCELLENT" | "GOOD" | "MODERATE" | "POOR";
}

export async function evaluate(
  latitude: number,
  longitude: number,
  activity: string
) {
  const response = await api.get<WeatherEvaluation>("/weather/evaluate", {
    params: { latitude, longitude, activity },
  });
  return response.data;
}
