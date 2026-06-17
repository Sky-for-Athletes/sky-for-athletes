import { useState, useEffect, useCallback } from "react";
import * as locationService from "../services/location.service";

export function useFavorites() {
  const [favorites, setFavorites] = useState<locationService.FavoriteLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
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

  useEffect(() => {
    function onFocus() { fetchFavorites(); }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchFavorites]);

  const addFavorite = useCallback(
    async (data: locationService.SaveFavoriteData) => {
      const created = await locationService.saveFavorite(data);
      setFavorites((prev) => [...prev, created]);
      return created;
    },
    []
  );

  const removeFavorite = useCallback(async (id: string) => {
    await locationService.deleteFavorite(id);
    setFavorites((prev) => prev.filter((f) => f._id !== id));
  }, []);

  return { favorites, loading, fetchFavorites, addFavorite, removeFavorite };
}
