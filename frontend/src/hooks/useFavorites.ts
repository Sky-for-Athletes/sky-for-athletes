import { useState, useEffect, useCallback } from "react";
import * as locationService from "../services/location.service";

export function useFavorites() {
  const [favorites, setFavorites] = useState<locationService.FavoriteLocation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const data = await locationService.getFavorites();
      setFavorites(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = useCallback(
    async (data: locationService.SaveFavoriteData) => {
      const created = await locationService.saveFavorite(data);
      setFavorites((prev) => [...prev, created]);
      return created;
    },
    []
  );

  return { favorites, loading, fetchFavorites, addFavorite };
}
