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

export interface RouteSegment {
  index: number;
  lat: number;
  lon: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  heatIndex: number;
  windChill: number;
  comfortScore: number;
  verdict: "EXCELLENT" | "GOOD" | "MODERATE" | "POOR";
}

export interface CriticalSegment {
  fromIndex: number;
  toIndex: number;
  reason: string;
  avgScore: number;
}

export interface RouteEvaluation {
  activity: string;
  totalDistance?: number;
  overallScore: number;
  overallVerdict: "EXCELLENT" | "GOOD" | "MODERATE" | "POOR";
  segments: RouteSegment[];
  criticalSegments: CriticalSegment[];
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

export async function evaluateRoute(
  waypoints: [number, number][],
  activity: string
) {
  const response = await api.post<RouteEvaluation>("/weather/evaluate-route", {
    waypoints,
    activity,
  });
  return response.data;
}
