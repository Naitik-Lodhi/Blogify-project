// hooks/useFavorites.ts
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

export const useFavorites = () => {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const storageKey = `favorites_${user?.id}`;

  // Load favorites from localStorage when user changes
  useEffect(() => {
    if (!user) return setFavoriteIds([]);
    const stored = localStorage.getItem(storageKey);
    setFavoriteIds(stored ? JSON.parse(stored) : []);
  }, [user]);

  const saveToStorage = (ids: string[]) => {
    localStorage.setItem(storageKey, JSON.stringify(ids));
    setFavoriteIds(ids); // triggers re-render
  };

  const addFavorite = (blogId: string) => {
    if (favoriteIds.includes(blogId)) return;
    const updated = [...favoriteIds, blogId];
    saveToStorage(updated);
  };

  const removeFavorite = (blogId: string) => {
    const updated = favoriteIds.filter((id) => id !== blogId);
    saveToStorage(updated);
  };

  const toggleFavorite = (blogId: string) => {
    if (favoriteIds.includes(blogId)) {
      removeFavorite(blogId);
    } else {
      addFavorite(blogId);
    }
    console.log("Favorites updated:", blogId);
  };

  const isFavorite = useCallback(
    (blogId: string) => favoriteIds.includes(blogId),
    [favoriteIds]
  );

  return {
    favoriteIds,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
};
