import { useState, useEffect, useCallback } from "react";
import { getHistory, type SearchHistoryItem } from "../services/location.service";

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getHistory();
      setHistory(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { history, loading, refresh: fetch };
}
