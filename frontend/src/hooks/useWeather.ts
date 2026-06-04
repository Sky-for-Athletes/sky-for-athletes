import { useState, useCallback } from "react";
import * as weatherService from "../services/weather.service";

export function useWeather() {
  const [data, setData] = useState<weatherService.WeatherEvaluation | null>(null);
  const [routeData, setRouteData] = useState<weatherService.RouteEvaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const evaluate = useCallback(
    async (latitude: number, longitude: number, activity: string) => {
      setLoading(true);
      setError(null);
      setRouteData(null);
      try {
        const result = await weatherService.evaluate(latitude, longitude, activity);
        setData(result);
        return result;
      } catch (err: any) {
        const msg = err.response?.data?.error || err.message || "Erro ao avaliar clima";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const evaluateRouteFn = useCallback(
    async (waypoints: [number, number][], activity: string) => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const result = await weatherService.evaluateRoute(waypoints, activity);
        setRouteData(result);
        return result;
      } catch (err: any) {
        const msg = err.response?.data?.error || err.message || "Erro ao avaliar rota";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setData(null);
    setRouteData(null);
    setError(null);
  }, []);

  return { data, routeData, loading, error, evaluate, evaluateRoute: evaluateRouteFn, reset };
}
