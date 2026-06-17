import { useState, useEffect, useCallback } from "react";
import { getHistory, type SearchHistoryItem } from "../services/location.service";

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
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
