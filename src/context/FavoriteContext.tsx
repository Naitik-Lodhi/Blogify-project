import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

interface FavoriteContextType {
  favoriteIds: string[];
  toggleFavorite: (blogId: string) => void;
  isFavorite: (blogId: string) => boolean;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Delay any logic until user is ready
  useEffect(() => {
    if (!user) return;

    const storageKey = `favorites_${user.id}`;
    const stored = localStorage.getItem(storageKey);
    setFavoriteIds(stored ? JSON.parse(stored) : []);
  }, [user]);

  const toggleFavorite = (blogId: string) => {
    if (!user) return; // guard
    const storageKey = `favorites_${user.id}`;
    let updated: string[];

    if (favoriteIds.includes(blogId)) {
      updated = favoriteIds.filter((id) => id !== blogId);
    } else {
      updated = [...favoriteIds, blogId];
    }

    setFavoriteIds(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const isFavorite = useCallback(
    (blogId: string) => favoriteIds.includes(blogId),
    [favoriteIds]
  );

  return (
    <FavoriteContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) throw new Error("useFavorites must be used within FavoriteProvider");
  return context;
};
