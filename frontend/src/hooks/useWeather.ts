import { useState, useCallback } from "react";
import * as weatherService from "../services/weather.service";

export function useWeather() {
  const [data, setData] = useState<weatherService.WeatherEvaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const evaluate = useCallback(
    async (latitude: number, longitude: number, activity: string) => {
      setLoading(true);
      setError(null);
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

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, evaluate, reset };
}
